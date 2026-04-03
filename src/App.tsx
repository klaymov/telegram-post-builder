import PostPreview from './components/PostPreview'
import PostEditor from './components/PostEditor'
import PostSettings from './components/PostSettings'
import MediaUpload from './components/MediaUpload'
import InlineKeyboard from './components/InlineKeyboard'
import BotConfig from './components/BotConfig'
import { usePostStore } from './store'
import { sendToTelegram } from './api/telegram'
import { Send, RotateCcw, CheckCircle, AlertCircle, LayoutTemplate } from 'lucide-react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function App() {
  const isSending = usePostStore((s) => s.isSending)
  const sendStatus = usePostStore((s) => s.sendStatus)
  const sendMessage = usePostStore((s) => s.sendMessage)
  const setIsSending = usePostStore((s) => s.setIsSending)
  const setSendStatus = usePostStore((s) => s.setSendStatus)
  const resetPost = usePostStore((s) => s.resetPost)

  useEffect(() => {
    if (sendStatus !== 'idle') {
      const timer = setTimeout(() => setSendStatus('idle'), 4000)
      return () => clearTimeout(timer)
    }
  }, [sendStatus, setSendStatus])

  const handleSend = async () => {
    setIsSending(true)
    setSendStatus('idle')
    try {
      await sendToTelegram()
      setSendStatus('success', 'Пост успішно надіслано! 🎉')
    } catch (err) {
      setSendStatus('error', err instanceof Error ? err.message : 'Невідома помилка')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--tg-theme-bg-color)] selection:bg-blue-500/30">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-[#09090b]/70 border-b border-black/5 dark:border-white/5">
        <div className="max-w-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-center relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <LayoutTemplate size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[19px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                PostBuilder
              </h1>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 -mt-1.5 font-normal">
                by letlyo
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-6 pb-[160px] space-y-8">
        <PostPreview />
        <BotConfig />
        <PostEditor />
        <MediaUpload />
        <PostSettings />
        <InlineKeyboard />
        
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={resetPost}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 text-[15px] font-semibold transition-colors active:scale-95"
          >
            <RotateCcw size={16} strokeWidth={2.5} />
            <span>Очистити всі поля</span>
          </button>
        </div>
      </main>

      {/* Notification Toast */}
      <AnimatePresence>
        {sendStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed top-20 left-4 right-4 z-50 pointer-events-none"
          >
            <div className={`mx-auto max-w-sm flex items-start gap-3 p-4 rounded-2xl shadow-xl shadow-black/10 backdrop-blur-xl border ${
              sendStatus === 'success'
                ? 'bg-emerald-500/90 text-white border-emerald-400/30'
                : 'bg-red-500/90 text-white border-red-400/30'
            }`}>
              {sendStatus === 'success' ? (
                <CheckCircle size={20} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
              )}
              <p className="text-[15px] font-medium leading-snug drop-shadow-sm">{sendMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[var(--tg-theme-bg-color)] via-[var(--tg-theme-bg-color)] to-transparent pt-12 pb-6 px-4">
        <div className="max-w-xl mx-auto flex flex-col gap-3 relative">
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSend}
            disabled={isSending}
            className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-[17px] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {isSending ? (
              <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                Надіслати пост
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
