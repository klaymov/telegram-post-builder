import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        "bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]",
        "border border-white/20 dark:border-white/5",
        "rounded-[24px] p-5 sm:p-6 overflow-hidden relative",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({ title, icon: Icon, color }: { title: string; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={cn("flex items-center justify-center w-10 h-10 rounded-full", color)}>
        <Icon size={20} className="text-current" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-[var(--tg-theme-text-color)]">
        {title}
      </h2>
    </div>
  )
}

export function FancyInput({ 
  icon: Icon, 
  value, 
  onChange, 
  placeholder, 
  type = "text" 
}: { 
  icon?: any; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--tg-theme-hint-color)] transition-colors group-focus-within:text-blue-500">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full bg-gray-50/50 dark:bg-black/20",
          "border border-gray-200 dark:border-white/10",
          "rounded-2xl py-3.5 text-[15px] font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-[#2c2c2e]",
          "placeholder-[var(--tg-theme-hint-color)] text-[var(--tg-theme-text-color)]",
          Icon ? "pl-11 pr-4" : "px-4"
        )}
      />
    </div>
  )
}

export function FancySwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative flex items-center h-[32px] w-[52px] rounded-full p-[2px] cursor-pointer transition-colors duration-300",
        checked ? "bg-[#34c759]" : "bg-gray-200 dark:bg-gray-700"
      )}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-[28px] h-[28px] bg-white rounded-full shadow-sm"
        style={{ x: checked ? 20 : 0 }}
      />
    </button>
  )
}
