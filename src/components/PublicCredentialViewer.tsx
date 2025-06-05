
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from 'lucide-react'

interface Credential {
  id: string
  name: string
  role: string
  organization: string
  date: string
  issue: string
  expiry: string
  volumes?: string[]
  hideVolumes?: boolean
}

interface PublicCredentialViewerProps {
  onBack: () => void
}

export default function PublicCredentialViewer({ onBack }: PublicCredentialViewerProps) {
  const [credentialId, setCredentialId] = useState("")
  const [lastName, setLastName] = useState("")
  const [foundCredential, setFoundCredential] = useState<Credential | null>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSearch = () => {
    const saved = localStorage.getItem('jessCredentials')
    if (saved) {
      const credentials: Credential[] = JSON.parse(saved)
      const credential = credentials.find(c => 
        c.id === credentialId && 
        c.name.toLowerCase().includes(lastName.toLowerCase())
      )
      
      if (credential) {
        setFoundCredential(credential)
        setError("")
        toast({
          title: "Credential found",
          description: "Your credential has been located successfully.",
        })
      } else {
        setError("Credential not found. Please check your ID and last name.")
        setFoundCredential(null)
      }
    } else {
      setError("No credentials found in the system.")
      setFoundCredential(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto shadow-xl">
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
            </Button>
            <div className="text-center space-y-2 flex-1">
              <h1 className="text-2xl font-bold text-blue-800">View Your Credential</h1>
              <p className="text-gray-600">Enter your details to access your credential</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Input 
              placeholder="Credential ID" 
              value={credentialId} 
              onChange={e => setCredentialId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center"
            />
            <Input 
              placeholder="Last Name" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center"
            />
            <Button onClick={handleSearch} className="w-full">View Credential</Button>
            
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>

          {foundCredential && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Credential Found</h3>
              <div className="space-y-1 text-sm text-green-700">
                <p><strong>Name:</strong> {foundCredential.name}</p>
                <p><strong>Role:</strong> {foundCredential.role}</p>
                <p><strong>Organization:</strong> {foundCredential.organization}</p>
                <p><strong>Issue Date:</strong> {foundCredential.issue}</p>
                <p><strong>Expiry Date:</strong> {foundCredential.expiry}</p>
                <p><strong>ID:</strong> {foundCredential.id}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
