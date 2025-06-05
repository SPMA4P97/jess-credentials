
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from 'lucide-react'
import CredentialSearchForm from './CredentialSearchForm'
import CredentialDisplay from './CredentialDisplay'
import { fetchCredentialByIdFromSupabase } from '../utils/supabaseAPI'

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

interface SupabaseCredential {
  id: string
  name: string
  role: string
  organization_name: string
  issue_date: string
  info: string
  expiry_date: string
  volumes: string
  public_credential_url: string
}

interface PublicCredentialViewerProps {
  onBack: () => void
}

export default function PublicCredentialViewer({ onBack }: PublicCredentialViewerProps) {
  const [foundCredential, setFoundCredential] = useState<Credential | null>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSearch = async (credentialId: string, lastName: string) => {
    if (!credentialId.trim() || !lastName.trim()) {
      setError("Please enter both credential ID and last name.")
      setFoundCredential(null)
      return
    }

    try {
      // Fetch from Supabase instead of localStorage
      const supabaseCredential: SupabaseCredential | null = await fetchCredentialByIdFromSupabase(credentialId)
      
      if (supabaseCredential) {
        // Check if the last name matches (case insensitive)
        if (supabaseCredential.name.toLowerCase().includes(lastName.toLowerCase())) {
          // Convert Supabase credential to local format
          const credential: Credential = {
            id: supabaseCredential.id,
            name: supabaseCredential.name,
            role: supabaseCredential.role,
            organization: supabaseCredential.organization_name,
            date: supabaseCredential.issue_date,
            issue: supabaseCredential.info,
            expiry: supabaseCredential.expiry_date,
            volumes: supabaseCredential.volumes ? supabaseCredential.volumes.split(', ').filter(Boolean) : []
          }
          
          setFoundCredential(credential)
          setError("")
          toast({
            title: "Credential found",
            description: "Your credential has been located successfully.",
          })
        } else {
          setError("Credential ID found but last name doesn't match.")
          setFoundCredential(null)
        }
      } else {
        setError("Credential not found. Please check your ID and last name.")
        setFoundCredential(null)
      }
    } catch (err) {
      console.error('Error searching credential:', err)
      setError("Error searching for credential. Please try again.")
      setFoundCredential(null)
    }
  }

  const handleViewPublicPage = () => {
    if (foundCredential) {
      // Redirect to public credential page 
      const publicUrl = `/credential/${foundCredential.id}`
      window.open(publicUrl, '_blank')
    }
  }

  const handleViewPDF = () => {
    if (foundCredential) {
      // Redirect to public credential page which has the PDF link
      const publicUrl = `/credential/${foundCredential.id}`
      window.open(publicUrl, '_blank')
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
            <div className="text-center space-y-4">
              <p className="text-green-600 text-sm">Credential found!</p>
              <CredentialDisplay 
                credential={foundCredential} 
                onViewPDF={handleViewPDF} 
              />
              <div className="flex gap-2 justify-center">
                <Button onClick={handleViewPublicPage} variant="outline">
                  View Public Page
                </Button>
                <Button onClick={handleViewPDF}>
                  View PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
