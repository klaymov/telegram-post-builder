import { usePostStore } from '../store'

const API_BASE = 'https://api.telegram.org/bot'

/**
 * Конвертує inline_keyboard з нашого формату у формат Telegram API
 */
function buildReplyMarkup(keyboard: any[][]) {
  const filtered = keyboard
    .map((row) => row.filter((btn) => btn.text.trim() && (btn.url?.trim() || btn.callback_data?.trim())))
    .filter((row) => row.length > 0)

  if (filtered.length === 0) return undefined

  return JSON.stringify({
    inline_keyboard: filtered.map((row) =>
      row.map((btn) => {
        if (btn.type === 'callback') {
          return { text: btn.text, callback_data: btn.callback_data }
        }
        return { text: btn.text, url: btn.url }
      })
    ),
  })
}

/**
 * Адаптує HTML з TipTap під жорсткі обмеження Telegram Bot API
 * Telegram не підтримує теги <p>, <div>, <br> тощо. 
 * Дозволені лише <b>, <i>, <u>, <s>, <a>, <code>, <pre>, <blockquote>.
 */
function cleanTelegramHtml(html: string): string {
  if (!html) return ''

  let text = html
  // Заміна <br> на перенесення рядка
  text = text.replace(/<br\s*\/?>/gi, '\n')
  
  // TipTap обортає кожен абзац у <p>...</p>. 
  // Заміняємо закриваючий тег на \n, а відкриваючий просто видаляємо.
  text = text.replace(/<\/p>/gi, '\n')
  text = text.replace(/<p>/gi, '')

  return text.trim()
}

/**
 * Відправляє текстове повідомлення без медіа
 */
async function sendTextMessage(token: string, chatId: string, html: string, opts: {
  disableWebPagePreview: boolean
  replyMarkup?: string
}) {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: html,
    parse_mode: 'HTML',
    disable_web_page_preview: opts.disableWebPagePreview,
  }

  if (opts.replyMarkup) {
    body.reply_markup = opts.replyMarkup
  }

  const res = await fetch(`${API_BASE}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return res.json()
}

/**
 * Відправляє одне фото/відео/документ/анімацію
 */
async function sendSingleMedia(token: string, chatId: string, file: File, mediaType: string, caption: string, opts: {
  replyMarkup?: string
}) {
  const methodMap: Record<string, string> = {
    photo: 'sendPhoto',
    video: 'sendVideo',
    document: 'sendDocument',
    animation: 'sendAnimation',
  }

  const fieldMap: Record<string, string> = {
    photo: 'photo',
    video: 'video',
    document: 'document',
    animation: 'animation',
  }

  const method = methodMap[mediaType] || 'sendDocument'
  const field = fieldMap[mediaType] || 'document'

  const formData = new FormData()
  formData.append('chat_id', chatId)
  formData.append(field, file)
  if (caption) {
    formData.append('caption', caption)
    formData.append('parse_mode', 'HTML')
  }

  if (opts.replyMarkup) {
    formData.append('reply_markup', opts.replyMarkup)
  }

  const res = await fetch(`${API_BASE}${token}/${method}`, {
    method: 'POST',
    body: formData,
  })

  return res.json()
}

/**
 * Відправляє медіа-групу (2+ файлів)
 * Увага: інлайн-клавіатура не підтримується для медіа-груп
 */
async function sendMediaGroupCall(token: string, chatId: string, files: File[], mediaType: string, caption: string) {
  const typeMap: Record<string, string> = {
    photo: 'photo',
    video: 'video',
    document: 'document',
    animation: 'photo', // fallback
  }

  const formData = new FormData()
  formData.append('chat_id', chatId)

  const media = files.map((file, i) => {
    const key = `file_${i}`
    formData.append(key, file)
    const item: Record<string, string> = {
      type: typeMap[mediaType] || 'document',
      media: `attach://${key}`,
    }
    if (i === 0 && caption) {
      item.caption = caption
      item.parse_mode = 'HTML'
    }
    return item
  })

  formData.append('media', JSON.stringify(media))

  const res = await fetch(`${API_BASE}${token}/sendMediaGroup`, {
    method: 'POST',
    body: formData,
  })

  return res.json()
}

/**
 * Головна функція відправки — розгалужує логіку залежно від наявності медіа
 */
export async function sendToTelegram() {
  const state = usePostStore.getState()
  const { botToken, chatId, htmlContent, mediaFiles, mediaType, keyboard, disableWebPagePreview } = state

  if (!botToken.trim()) throw new Error('Введіть токен бота')
  if (!chatId.trim()) throw new Error('Введіть Chat ID')
  if (!htmlContent.trim() && mediaFiles.length === 0) throw new Error('Пост порожній — додайте текст або медіа')

  const replyMarkup = buildReplyMarkup(keyboard)
  const text = cleanTelegramHtml(htmlContent)

  // Без медіа — просто текст
  if (mediaFiles.length === 0) {
    const result = await sendTextMessage(botToken, chatId, text, {
      disableWebPagePreview,
      replyMarkup,
    })
    if (!result.ok) throw new Error(result.description || 'Помилка відправки')
    return result
  }

  // Одне медіа
  if (mediaFiles.length === 1) {
    const result = await sendSingleMedia(botToken, chatId, mediaFiles[0], mediaType, text, {
      replyMarkup,
    })
    if (!result.ok) throw new Error(result.description || 'Помилка відправки')
    return result
  }

  // Медіа-група (2+ файлів) — клавіатура не доступна
  const result = await sendMediaGroupCall(botToken, chatId, mediaFiles, mediaType, text)
  if (!result.ok) throw new Error(result.description || 'Помилка відправки')
  return result
}
