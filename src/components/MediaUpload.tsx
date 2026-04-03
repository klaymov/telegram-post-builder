import { usePostStore } from '../store'
import { Image, Film, FileText, X, UploadCloud, Images } from 'lucide-react'
import { useRef } from 'react'
import { Card, SectionHeader } from './ui'
import { motion, AnimatePresence } from 'framer-motion'

const MEDIA_TYPES = [
  { value: 'photo' as const, label: 'Фотографії', icon: Image },
  { value: 'video' as const, label: 'Відео / Гіф', icon: Film },
  { value: 'document' as const, label: 'Файли', icon: FileText },
]

export default function MediaUpload() {
  const mediaFiles = usePostStore((s) => s.mediaFiles)
  const mediaType = usePostStore((s) => s.mediaType)
  const setMediaFiles = usePostStore((s) => s.setMediaFiles)
  const setMediaType = usePostStore((s) => s.setMediaType)
  const removeMediaFile = usePostStore((s) => s.removeMediaFile)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptMap: Record<string, string> = {
    photo: 'image/*',
    video: 'video/*',
    document: '*/*',
    animation: 'image/gif,video/mp4',
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setMediaFiles([...mediaFiles, ...files])
    }
    e.target.value = ''
  }

  return (
    <Card>
      <SectionHeader 
        title="Медіафайли" 
        icon={Images} 
        color="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" 
      />

      <div className="space-y-5">
        {/* Type Selector Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-black/40 rounded-xl overflow-x-auto no-scrollbar">
          {MEDIA_TYPES.map((type) => {
            const isActive = mediaType === type.value
            return (
              <button
                key={type.value}
                onClick={() => setMediaType(type.value)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mediaTypeTab"
                    className="absolute inset-0 bg-white dark:bg-[#2c2c2e] rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <type.icon size={16} />
                  {type.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-black/10 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:border-blue-500 transition-all group"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
            <UploadCloud size={24} />
          </div>
          <div className="text-center">
            <div className="font-semibold text-[15px] mb-1">Натисніть для завантаження</div>
            <div className="text-sm text-gray-500">Виберіть {MEDIA_TYPES.find(t => t.value === mediaType)?.label.toLowerCase()}</div>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptMap[mediaType]}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* File List */}
        <AnimatePresence>
          {mediaFiles.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {mediaFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-3 pl-4 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5"
                >
                  <div className="flex items-center min-w-0 pr-4">
                    <div className="truncate">
                      <div className="text-[14px] font-medium truncate mb-0.5">{file.name}</div>
                      <div className="text-[12px] text-gray-500">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMediaFile(index)}
                    className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full hover:bg-red-100 hover:text-red-500 text-gray-400 dark:hover:bg-red-500/20 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
