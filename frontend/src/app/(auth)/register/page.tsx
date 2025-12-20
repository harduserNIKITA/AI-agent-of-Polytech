'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/api/services/authService'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
    if (!formData.email.trim()) {
      setError('Введите email')
      setLoading(false)
      return
    }
    if (!formData.password.trim()) {
      setError('Введите пароль')
      setLoading(false)
      return
    }
    if (formData.password.length < 8) {
      setError('Пароль должен быть минимум 8 символов')
      setLoading(false)
      return
    }

    try {
      // 1. Регистрация
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      // 2. Авто-логин
      const tokens = await authService.login({
        username: formData.username,
        password: formData.password,
      })

      // 3. Сохраняем токены
      localStorage.setItem('accessToken', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)
      document.cookie = `accessToken=${tokens.access}; path=/; max-age=${7 * 24 * 60 * 60}`

      // 4. Создаем чат
      const chat = await authService.createChat(
        tokens.access,
        `Чат ${new Date().toLocaleDateString()}`
      )

      // 5. Переходим в чат
      router.push(`/chat/${chat.id}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Ошибка регистрации')
      setLoading(false)
    }
  }

  const goToLogin = () => {
    window.location.href = '/login'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>Создайте новый аккаунт</CardDescription>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Введите email"
                value={formData.email}
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
                placeholder="Минимум 8 символов"
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
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button
                onClick={goToLogin}
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium p-0 bg-transparent border-none cursor-pointer"
              >
                Войти
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
