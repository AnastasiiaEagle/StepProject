import { cn } from "@/lib/utils"

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    style?: "primary" | "secondary" | "danger"
}

export default function Button({ children, onClick, style }: ButtonProps) {
    const getClassStyle = () => {
        switch(style) {
            case "primary":
                return "flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer w-full"
            case "secondary":
                return "flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer w-full"
            case "danger":
                return "flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer w-full"
            default:
                return "flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 cursor-pointer w-full"
        }
    }
    return(
        <button className={cn(getClassStyle())} onClick={onClick}>
            {children}
        </button>
  )
}