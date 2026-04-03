import { usePostStore } from '../store'
import { Bot, Hash } from 'lucide-react'
import { Card, SectionHeader, FancyInput } from './ui'

export default function BotConfig() {
  const botToken = usePostStore((s) => s.botToken)
  const chatId = usePostStore((s) => s.chatId)
  const setBotToken = usePostStore((s) => s.setBotToken)
  const setChatId = usePostStore((s) => s.setChatId)

  return (
    <Card>
      <SectionHeader 
        title="Налаштування бота" 
        icon={Bot} 
        color="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" 
      />
      
      <div className="space-y-4">
        <FancyInput
          icon={Bot}
          type="password"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          placeholder="Токен бота (напр. 12345:ABC...)"
        />
        
        <FancyInput
          icon={Hash}
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="Chat ID (напр. -100123... або @channel_name)"
        />
      </div>
    </Card>
  )
}
