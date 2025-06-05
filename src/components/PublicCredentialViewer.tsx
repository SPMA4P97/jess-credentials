
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from 'lucide-react'
import CredentialSearchForm from './CredentialSearchForm'
import CredentialDisplay from './CredentialDisplay'
import { searchCredential } from '../utils/credentialSearch'
import { generateCredentialPDF } from '../utils/pdfGenerator'

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
  const [foundCredential, setFoundCredential] = useState<Credential | null>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSearch = (credentialId: string, lastName: string) => {
    const credential = searchCredential(credentialId, lastName)
    
    if (credential) {
      setFoundCredential(credential)
      setError("")
      toast({
        title: "Credential found",
        description: "Your credential has been located successfully.",
      })
    } else {
      const hasCredentials = localStorage.getItem('jessCredentials') || sessionStorage.getItem('jessCredentials')
      if (hasCredentials) {
        setError("Credential not found. Please check your ID and last name.")
      } else {
        setError("No credentials found in the system. Credentials may have been created on a different browser or device.")
      }
      setFoundCredential(null)
    }
  }

  const handleViewPDF = () => {
    if (foundCredential) {
      generateCredentialPDF(foundCredential)
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
          
          <CredentialSearchForm onSearch={handleSearch} />
          
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {foundCredential && (
            <CredentialDisplay 
              credential={foundCredential} 
              onViewPDF={handleViewPDF} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
