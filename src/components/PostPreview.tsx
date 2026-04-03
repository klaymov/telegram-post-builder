import { usePostStore } from '../store'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function PostPreview() {
  const htmlContent = usePostStore((s) => s.htmlContent)
  const mediaFiles = usePostStore((s) => s.mediaFiles)
  const mediaType = usePostStore((s) => s.mediaType)
  const keyboard = usePostStore((s) => s.keyboard)
  
  const [mediaUrls, setMediaUrls] = useState<string[]>([])

  useEffect(() => {
    // Створюємо object URLs для прев'ю медіа
    const urls = mediaFiles.map(file => URL.createObjectURL(file))
    setMediaUrls(urls)

    return () => {
      // Очищаємо URLs при анмаунті
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [mediaFiles])

  const currentTime = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })

  if (!htmlContent.trim() && mediaFiles.length === 0 && keyboard.length === 0) {
    return null
  }

  return (
    <div className="w-full mb-8 perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="max-w-[460px] mx-auto overflow-hidden bg-[length:300px_300px]"
        style={{
          // Telegram background pattern pattern
          backgroundImage: 'url("https://telegram.org/file/464001923/1183d/QzJc7D5S4xY.35038.png/264b3c0e352f7f98e8")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="w-full h-full bg-[#E5E5EA]/90 dark:bg-[#0E1621]/90 backdrop-blur-md p-5 pb-8 rounded-[28px] border-[5px] border-white dark:border-[#1C1C1E] shadow-2xl relative">
          
          <div className="flex flex-col items-start gap-1 w-full max-w-[380px] mx-auto">
            
            {/* Message Bubble */}
            <div className="relative bg-white dark:bg-[#182533] text-black dark:text-white rounded-[18px] rounded-bl-sm shadow-sm overflow-hidden w-full">
              
              {/* Media Preview */}
              {mediaUrls.length > 0 && (
                <div className={`grid gap-[2px] w-full ${mediaUrls.length === 1 ? 'grid-cols-1' : mediaUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {mediaUrls.slice(0, 4).map((url, i) => (
                    <div key={i} className="relative aspect-square sm:aspect-[4/3] w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                       {mediaType === 'video' || mediaType === 'animation' ? (
                          <video src={url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                       ) : (
                          <img src={url} className="w-full h-full object-cover" alt="preview" />
                       )}
                    </div>
                  ))}
                  {mediaUrls.length > 4 && (
                    <div className="absolute bottom-0 right-0 w-12 h-12 bg-black/50 text-white flex items-center justify-center font-semibold text-lg">
                      +{mediaUrls.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Text Content */}
              {htmlContent.trim() && (
                <div className="px-3 pt-2 pb-5 min-h[20px]">
                  <div 
                    className="text-[15px] leading-[1.35] break-words telegram-html-preview" 
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                  />
                </div>
              )}

              {/* Time indicator (absolute inside bubble bottom right if text exists, else normal flow) */}
              <div className={`absolute bottom-1 right-2 text-[11px] text-gray-400 dark:text-[#7f91a4]`}>
                {currentTime}
              </div>

              {/* Message Tail Fake */}
              <svg viewBox="0 0 11 20" className="absolute bottom-0 -left-[9px] w-[11px] h-[20px] text-white dark:text-[#182533] fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 20H0C5.52285 20 10 15.5228 10 10V0H11V20Z" />
              </svg>
            </div>

            {/* Inline Keyboard Preview */}
            <AnimatePresence>
              {keyboard.length > 0 && !(mediaFiles.length > 1) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col gap-[2px] mt-[2px]"
                >
                  {keyboard.map((row, rowIndex) => {
                    const validButtons = row.filter((btn) => btn.text.trim())
                    if (validButtons.length === 0) return null

                    return (
                      <div key={rowIndex} className="flex gap-[2px] w-full">
                        {validButtons.map((btn, btnIndex) => (
                          <div
                            key={btnIndex}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#252a32]/10 dark:bg-[#202b36] backdrop-blur-md rounded-lg text-[14px] font-semibold text-[#3390ec] dark:text-[#6ab2f2] transition-colors overflow-hidden"
                            style={{ 
                              borderTopLeftRadius: rowIndex === 0 && btnIndex === 0 ? '6px' : btnIndex === 0 ? '0px' : '0px',
                              borderTopRightRadius: rowIndex === 0 && btnIndex === validButtons.length - 1 ? '6px' : btnIndex === validButtons.length - 1 ? '0px' : '0px',
                              borderBottomLeftRadius: rowIndex === keyboard.length - 1 && btnIndex === 0 ? '12px' : btnIndex === 0 ? '0px' : '0px',
                              borderBottomRightRadius: rowIndex === keyboard.length - 1 && btnIndex === validButtons.length - 1 ? '12px' : btnIndex === validButtons.length - 1 ? '0px' : '0px',
                            }}
                          >
                            <span className="truncate max-w-[90%] px-1">{btn.text}</span>
                            {btn.type === 'url' && btn.url && <ArrowUpRight size={13} strokeWidth={2.5} className="opacity-70 shrink-0" />}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
