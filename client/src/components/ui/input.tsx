import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string
  error?: string
  style?: "primary" | "secondary"
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, style, ...props }, ref) => {
    const getInputStyle = () => {
      switch(style) {
        case "primary":
          return "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        case "secondary":
          return "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
        default:
          return "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          className={cn(
            "flex w-full px-3 py-2 text-sm border rounded-md transition-colors",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-opacity-50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : getInputStyle(),
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
