'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      // Если пользователь авторизован — сразу в чаты
      router.replace('/chat')
    } else {
      // Если не авторизован — на логин
      router.replace('/login')
    }
  }, [router])

  // Ничего не рисуем, просто мгновенный редирект
  return null
}

