// frontend/src/lib/api/services/authService.ts

const API_BASE = 'http://127.0.0.1:8000'

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE}/api/v1/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error.detail ||
          (error.non_field_errors && error.non_field_errors[0]) ||
          'Ошибка входа'
      )
    }

    return response.json()
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    const response = await fetch(`${API_BASE}/api/v1/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        (error.username && error.username[0]) ||
          (error.email && error.email[0]) ||
          (error.password && error.password[0]) ||
          'Ошибка регистрации'
      )
    }
  },

  async createChat(accessToken: string, title: string): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE}/api/v1/chats/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })

    if (!response.ok) {
      throw new Error('Ошибка создания чата')
    }

    return response.json()
  },
}
