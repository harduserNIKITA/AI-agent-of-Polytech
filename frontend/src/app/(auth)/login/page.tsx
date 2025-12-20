'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/api/services/authService'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.username.trim()) {
      setError('Введите имя пользователя')
      setLoading(false)
      return
    }
    if (!formData.password.trim()) {
      setError('Введите пароль')
      setLoading(false)
      return
    }

    try {
      // 1. Логин через сервис
      const tokens = await authService.login({
        username: formData.username,
        password: formData.password,
      })

      // 2. Сохраняем токены
      localStorage.setItem('accessToken', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)
      document.cookie = `accessToken=${tokens.access}; path=/; max-age=${7 * 24 * 60 * 60}`

      // 3. Создаем новый чат
      const chat = await authService.createChat(
        tokens.access,
        `Чат ${new Date().toLocaleDateString()}`
      )

      // 4. Переходим в чат
      router.push(`/chat/${chat.id}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Ошибка при входе')
      setLoading(false)
    }
  }

  const goToRegister = () => {
    window.location.href = '/register'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Вход</CardTitle>
          <CardDescription>Введите свои учетные данные для входа</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Введите имя пользователя"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Загрузка...' : 'Войти'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <button
                onClick={goToRegister}
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium p-0 bg-transparent border-none cursor-pointer"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


