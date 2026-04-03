import { usePostStore } from '../store'
import { Plus, Trash2, Link, Keyboard, GripHorizontal } from 'lucide-react'
import { Card, SectionHeader, FancyInput } from './ui'
import { motion, AnimatePresence } from 'framer-motion'

export default function InlineKeyboard() {
  const keyboard = usePostStore((s) => s.keyboard)
  const addKeyboardRow = usePostStore((s) => s.addKeyboardRow)
  const removeKeyboardRow = usePostStore((s) => s.removeKeyboardRow)
  const addButton = usePostStore((s) => s.addButton)
  const removeButton = usePostStore((s) => s.removeButton)
  const updateButton = usePostStore((s) => s.updateButton)
  const isMediaGroup = usePostStore((s) => s.mediaFiles.length > 1)

  return (
    <Card>
      <SectionHeader 
        title="Клавіатура" 
        icon={Keyboard} 
        color="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" 
      />

      {isMediaGroup ? (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-[15px] font-medium text-center">
          При відправці медіа-групи клавіатура заблокована Telegram API 🚫
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {keyboard.map((row, rowIndex) => (
              <motion.div 
                key={rowIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border border-gray-200 dark:border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripHorizontal size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Ряд {rowIndex + 1}</span>
                  </div>
                  <button
                    onClick={() => removeKeyboardRow(rowIndex)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    title="Видалити ряд"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {row.map((btn, btnIndex) => (
                      <motion.div 
                        key={btn.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col sm:flex-row items-end gap-2 relative bg-white dark:bg-[#1c1c1e] p-2 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm"
                      >
                        <div className="flex-[0.8] w-full">
                          <FancyInput
                            type="text"
                            placeholder="Текст кнопки"
                            value={btn.text}
                            onChange={(e) => updateButton(rowIndex, btnIndex, 'text', e.target.value)}
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2c2c2e] p-1 rounded-lg self-start">
                            <button
                              onClick={() => updateButton(rowIndex, btnIndex, 'type', 'url')}
                              className={`px-3 py-1 text-[13px] font-medium rounded-md transition-colors ${
                                btn.type === 'url' ? 'bg-white dark:bg-[#1c1c1e] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                              }`}
                            >
                              URL
                            </button>
                            <button
                              onClick={() => updateButton(rowIndex, btnIndex, 'type', 'callback')}
                              className={`px-3 py-1 text-[13px] font-medium rounded-md transition-colors ${
                                btn.type === 'callback' ? 'bg-white dark:bg-[#1c1c1e] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                              }`}
                            >
                              Callback
                            </button>
                          </div>
                          
                          <div className="flex gap-2 w-full">
                            <div className="flex-1">
                              {btn.type === 'callback' ? (
                                <FancyInput
                                  type="text"
                                  placeholder="callback_data (напр. action_1)"
                                  value={btn.callback_data || ''}
                                  onChange={(e) => updateButton(rowIndex, btnIndex, 'callback_data', e.target.value)}
                                />
                              ) : (
                                <FancyInput
                                  icon={Link}
                                  type="url"
                                  placeholder="https://"
                                  value={btn.url || ''}
                                  onChange={(e) => updateButton(rowIndex, btnIndex, 'url', e.target.value)}
                                />
                              )}
                            </div>
                            <button
                              onClick={() => removeButton(rowIndex, btnIndex)}
                              className="shrink-0 w-12 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => addButton(rowIndex)}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-white/20 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <Plus size={16} />
                  Додати кнопку в цей ряд
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={addKeyboardRow}
            className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {keyboard.length === 0 ? 'Створити клавіатуру' : 'Створити новий ряд'}
          </button>
        </div>
      )}
    </Card>
  )
}
