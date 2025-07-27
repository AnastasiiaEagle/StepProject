"use client"

import { useState } from "react"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import { Eye, EyeOff, Lock, User, Mail } from "lucide-react"
import { authService } from "@/services/auth/auth.service"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email обов'язковий"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введіть коректний email"
    }

    if (!formData.password) {
      newErrors.password = "Пароль обов'язковий"
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль має бути не менше 6 символів"
    }

    if (!isLogin && !formData.nickname) {
      newErrors.nickname = "Нікнейм обов'язковий"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")
    
    try {
      console.log(`${isLogin ? 'Login' : 'Register'} with:`, formData)
      console.log(process.env.REACT_APP_API_URL)

      
      if (isLogin) {
        const result = await authService.login(formData.email, formData.password)
        setSuccessMessage(`Вітаємо, ${result.user.nickname}! Успішний вхід в систему.`)
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        const result = await authService.register(formData.email, formData.password, formData.nickname)
        setSuccessMessage(`Вітаємо, ${result.user.nickname}! Реєстрація пройшла успішно.`)
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      if (error.response?.status === 409) {
        setErrorMessage("Користувач з таким email або нікнеймом вже існує")
      } else if (error.response?.status === 401) {
        setErrorMessage("Невірний email або пароль")
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message)
      } else {
        setErrorMessage("Сталася помилка. Спробуйте ще раз")
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ email: "", password: "", nickname: "" })
    setErrors({})
    setErrorMessage("")
    setSuccessMessage("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Увійти в акаунт" : "Створити акаунт"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Або " : "Або "}
            <button
              onClick={toggleMode}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isLogin ? "зареєструватися" : "увійти в існуючий акаунт"}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {successMessage}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Введіть ваш email"
              error={errors.email}
              style="primary"
            />

            {!isLogin && (
              <Input
                label="Нікнейм"
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="Введіть ваш нікнейм"
                error={errors.nickname}
                style="primary"
              />
            )}

            <div className="relative">
              <Input
                label="Пароль"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Введіть ваш пароль"
                error={errors.password}
                style="primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            style="primary"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isLogin ? "Вхід..." : "Реєстрація..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isLogin ? <Lock size={20} /> : <User size={20} />}
                {isLogin ? "Увійти" : "Зареєструватися"}
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}