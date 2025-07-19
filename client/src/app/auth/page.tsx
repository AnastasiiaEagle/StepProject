"use client"

import { useState } from "react"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import { Eye, EyeOff, Lock, User } from "lucide-react"

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    const newErrors = {
      email: "",
      password: ""
    }

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

    setErrors(newErrors)

    if (!newErrors.email && !newErrors.password) {
      // Here you would typically make an API call to authenticate
      console.log("Login attempt:", formData)
      // Redirect to admin panel or handle authentication
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Вхід в адмін панель
          </h1>
          <p className="text-gray-600">
            Введіть ваші облікові дані для доступу
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              style="primary"
              required
            />

            <div className="relative">
              <Input
                label="Пароль"
                type={showPassword ? "text" : "password"}
                placeholder="Введіть пароль"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
                style="primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-600">Запам'ятати мене (не працює)</span>
              </label>
            </div>

            <Button style="primary">
              <User className="h-4 w-4" />
              Увійти
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}