import type { FC } from "react"
import { Github, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SocialSignupProps {
  isLogin?: boolean
}

export const SocialSignup: FC<SocialSignupProps> = ({ isLogin = false }) => {
  const actionText = isLogin ? "Log in with" : "Sign up with"

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="w-full text-sm py-1 bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <Button
        variant="outline"
        className="w-full text-sm py-1 bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <Twitter className="mr-2 h-4 w-4" />
        Twitter
      </Button>
    </div>
  )
}
