"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Search, 
  Settings, 
  User, 
  FileText, 
  Calendar, 
  Mail, 
  Bell,
  ChevronLeft,
  Menu,
  Package,
  X,
  LogOut
} from 'lucide-react'
import Button from '../ui/button'
import { useRouter } from 'next/navigation'

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Головний сайт', href: '/' },
  { icon: Package, label: 'Продукти', href: '/admin-panel/products' },
  { icon: Calendar, label: 'Замовлення', href: '/admin-panel/orders' },
  { icon: User, label: 'Користувачі', href: '/admin-panel/users' },
  { icon: Settings, label: 'Налаштування', href: '/admin-panel/settings' },
]

export default function Slidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64",
          "bg-white border-r border-gray-200 shadow-lg"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Меню</h2>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-gray-100 hover:text-gray-900",
                "text-gray-600 relative group"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-3 flex-1">{item.label}</span>
                </>
              )}
            </a>
          ))}
        </nav>
        <div className="px-5">
            <Button onClick={() => {
              console.log("Вийти")
            }}>
              <LogOut />
              Вийти
            </Button>
          </div>
      </aside>
    </>
  )
}