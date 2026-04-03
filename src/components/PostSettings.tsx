import { usePostStore } from '../store'
import { Card, SectionHeader, FancySwitch } from './ui'
import { Settings2 } from 'lucide-react'

export default function PostSettings() {
  const disableWebPagePreview = usePostStore((s) => s.disableWebPagePreview)
  const toggleWebPagePreview = usePostStore((s) => s.toggleWebPagePreview)

  return (
    <Card>
      <SectionHeader 
        title="Параметри відправки" 
        icon={Settings2} 
        color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" 
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10">
          <div>
            <div className="font-medium text-[15px]">Передпоказ посилань</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Показувати прев'ю для лінків</div>
          </div>
          <FancySwitch checked={!disableWebPagePreview} onChange={toggleWebPagePreview} />
        </div>
      </div>
    </Card>
  )
}
