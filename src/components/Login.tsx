import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from 'lucide-react'
import PublicCredentialViewer from './PublicCredentialViewer'
import { supabase } from "@/integrations/supabase/client"

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
  const [showCredentialViewer, setShowCredentialViewer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async () => {
    setIsLoading(true)
    
    try {
      // Fetch users from Supabase
      const { data: supabaseUsers, error } = await supabase
        .from('users')
        .select('*')
      
      if (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "Login failed",
          description: "Unable to connect to user database",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Check credentials against Supabase users
      const user = supabaseUsers?.find(u => 
        (u.email === emailOrUsername || u.username === emailOrUsername) && 
        u.password === password
      )

      if (user) {
        // Store user info in localStorage for session management
        localStorage.setItem('jessCredentialsAuth', 'true')
        localStorage.setItem('jessCurrentUser', JSON.stringify({
          username: user.username,
          role: user.role,
          email: user.email,
          id: user.id
        }))

        // Convert Supabase user format to expected format with proper role typing
        const formattedUser: User = {
          id: user.id,
          email: user.email,
          username: user.username,
          password: user.password,
          role: (user.role === 'admin' || user.role === 'user') ? user.role : 'user',
          createdAt: user.created || new Date().toISOString()
        }

        onLogin(formattedUser)
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.username}!`,
        })
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  if (showCredentialViewer) {
    return <PublicCredentialViewer onBack={() => setShowCredentialViewer(false)} />
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
              disabled={isLoading}
            />
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Access Portal"}
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Have a credential to view?</p>
            <Button 
              variant="outline" 
              onClick={() => setShowCredentialViewer(true)}
              className="w-full"
              disabled={isLoading}
            >
              View My Credential
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
