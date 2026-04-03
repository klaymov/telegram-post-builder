export interface InlineButton {
  id: string
  text: string
  type: 'url' | 'callback'
  url: string
  callback_data: string
}

export type InlineKeyboardRow = InlineButton[]

export interface PostState {
  // Bot config
  botToken: string
  chatId: string

  // Post content
  htmlContent: string

  // Settings
  disableWebPagePreview: boolean

  // Media
  mediaFiles: File[]
  mediaType: 'photo' | 'video' | 'document' | 'animation'

  // Inline keyboard
  keyboard: InlineKeyboardRow[]

  // Sending state
  isSending: boolean
  sendStatus: 'idle' | 'success' | 'error'
  sendMessage: string

  // Actions
  setBotToken: (token: string) => void
  setChatId: (id: string) => void
  setHtmlContent: (html: string) => void
  toggleWebPagePreview: () => void
  setMediaFiles: (files: File[]) => void
  setMediaType: (type: 'photo' | 'video' | 'document' | 'animation') => void
  removeMediaFile: (index: number) => void
  addKeyboardRow: () => void
  removeKeyboardRow: (rowIndex: number) => void
  addButton: (rowIndex: number) => void
  removeButton: (rowIndex: number, buttonIndex: number) => void
  updateButton: (rowIndex: number, buttonIndex: number, field: 'text' | 'url' | 'callback_data' | 'type', value: string) => void
  setIsSending: (s: boolean) => void
  setSendStatus: (status: 'idle' | 'success' | 'error', message?: string) => void
  resetPost: () => void
}
