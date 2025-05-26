
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from 'lucide-react'

interface User {
  id: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

interface LoginProps {
  onLogin: (user: User) => void
  users: User[]
}

export default function Login({ onLogin, users }: LoginProps) {
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleLogin = () => {
    const user = users.find(u => 
      (u.email === emailOrUsername || u.username === emailOrUsername) && 
      u.password === password
    )
    if (user) {
      onLogin(user)
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.email}!`,
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email/username or password",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto shadow-xl">
        <CardContent className="space-y-6 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-800">JESS Credentials Portal</h1>
            <p className="text-gray-600">Journal of Emerging Sport Studies</p>
          </div>
          
          <div className="space-y-4">
            <Input 
              placeholder="Email or Username" 
              value={emailOrUsername} 
              onChange={e => setEmailOrUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center"
            />
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleLogin} className="w-full">Access Portal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
