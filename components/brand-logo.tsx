import type { FC } from "react"
import { Shield } from "lucide-react"

interface BrandLogoProps {
  className?: string
}

export const BrandLogo: FC<BrandLogoProps> = ({ className }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-purple-600 p-2 text-white ${className}`}>
      <Shield className="h-6 w-6" />
    </div>
  )
}
