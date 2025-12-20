'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ChatsPage() {
  const router = useRouter()

  const handleLogout = () => {
    // чистим токены
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    document.cookie =
      'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'

    // на логин
    router.replace('/login')
  }

  return (
    // НИЧЕГО не рендерим, кроме кнопки выхода поверх твоего layout
    <div className="pointer-events-none">
      <div className="fixed top-4 right-4 z-50 pointer-events-auto">
        <Button
          variant="outline"
          className="bg-white/80 hover:bg-white"
          onClick={handleLogout}
        >
          Выход
        </Button>
      </div>
    </div>
  )
}
