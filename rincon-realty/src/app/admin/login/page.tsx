'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createBrowserClient } from '@/lib/supabase/client'
import { SITE_NAME } from '@/config/site'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')

    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError('Credenciales incorrectas')
      } else {
        router.push('/admin/leads')
        router.refresh()
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-ink mb-2">
              {SITE_NAME}
            </h1>
            <p className="text-neutral-500">Panel de administración</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              error={errors.email?.message}
              disabled={loading}
            />

            <Input
              label="Contraseña"
              type="password"
              {...register('password', {
                required: 'Contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'Mínimo 6 caracteres',
                },
              })}
              error={errors.password?.message}
              disabled={loading}
            />

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}