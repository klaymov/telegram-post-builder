import { create } from 'zustand'
import type { PostState } from './types'

const generateId = () => Math.random().toString(36).substring(2, 9)

export const usePostStore = create<PostState>((set) => ({
  // Bot config
  botToken: localStorage.getItem('pb_bot_token') || '',
  chatId: localStorage.getItem('pb_chat_id') || '',

  // Post content
  htmlContent: '',

  // Settings
  disableWebPagePreview: true,

  // Media
  mediaFiles: [],
  mediaType: 'photo',

  // Keyboard
  keyboard: [],

  // Send state
  isSending: false,
  sendStatus: 'idle',
  sendMessage: '',

  // Actions
  setBotToken: (token) => {
    localStorage.setItem('pb_bot_token', token)
    set({ botToken: token })
  },

  setChatId: (id) => {
    localStorage.setItem('pb_chat_id', id)
    set({ chatId: id })
  },

  setHtmlContent: (html) => set({ htmlContent: html }),

  toggleWebPagePreview: () => set((s) => ({ disableWebPagePreview: !s.disableWebPagePreview })),

  setMediaFiles: (files) => set({ mediaFiles: files }),

  setMediaType: (type) => set({ mediaType: type }),

  removeMediaFile: (index) =>
    set((s) => ({
      mediaFiles: s.mediaFiles.filter((_, i) => i !== index),
    })),

  addKeyboardRow: () =>
    set((s) => ({
      keyboard: [
        ...s.keyboard,
        [{ id: generateId(), text: '', type: 'url', url: '', callback_data: '' }],
      ],
    })),

  removeKeyboardRow: (rowIndex) =>
    set((s) => ({
      keyboard: s.keyboard.filter((_, i) => i !== rowIndex),
    })),

  addButton: (rowIndex) =>
    set((s) => ({
      keyboard: s.keyboard.map((row, i) =>
        i === rowIndex
          ? [...row, { id: generateId(), text: '', type: 'url', url: '', callback_data: '' }]
          : row
      ),
    })),

  removeButton: (rowIndex, buttonIndex) =>
    set((s) => ({
      keyboard: s.keyboard.map((row, i) =>
        i === rowIndex
          ? row.filter((_, j) => j !== buttonIndex)
          : row
      ).filter((row) => row.length > 0),
    })),

  updateButton: (rowIndex, buttonIndex, field, value) =>
    set((s) => ({
      keyboard: s.keyboard.map((row, i) =>
        i === rowIndex
          ? row.map((btn, j) =>
              j === buttonIndex ? { ...btn, [field]: value } : btn
            )
          : row
      ),
    })),

  setIsSending: (s) => set({ isSending: s }),

  setSendStatus: (status, message = '') => set({ sendStatus: status, sendMessage: message }),

  resetPost: () =>
    set({
      htmlContent: '',
      mediaFiles: [],
      keyboard: [],
      sendStatus: 'idle',
      sendMessage: '',
    }),
}))
