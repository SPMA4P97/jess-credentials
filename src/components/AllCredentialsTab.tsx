import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import CredentialsList from './CredentialsList'
import { fetchAllCredentialsFromSupabase, deleteCredentialFromSupabase } from '../utils/supabaseAPI'

interface Credential {
  id: string
  name: string
  role: string
  organization_name: string
  issue_date: string
  info: string
  expiry_date: string
  volumes?: string
  public_credential_url?: string
}

interface AllCredentialsTabProps {
  onViewPDF: (credential: any) => void
}

export default function AllCredentialsTab({ onViewPDF }: AllCredentialsTabProps) {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchCredentials = async () => {
    setLoading(true)
    const supabaseCredentials = await fetchAllCredentialsFromSupabase()
    
    // Transform Supabase data to match the expected format
    const transformedCredentials = supabaseCredentials.map((cred: any) => ({
      id: cred.id,
      name: cred.name || '',
      role: cred.role || '',
      organization: cred.organization_name || '',
      date: cred.issue_date || '',
      issue: cred.info || '',
      expiry: cred.expiry_date || '',
      volumes: cred.volumes ? cred.volumes.split(', ').filter(Boolean) : [],
      hideVolumes: !cred.volumes,
      public_credential_url: cred.public_credential_url
    }))
    
    setCredentials(transformedCredentials)
    setLoading(false)
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  const handleDeleteCredential = async (id: string) => {
    const success = await deleteCredentialFromSupabase(id)
    
    if (success) {
      // Remove from local state
      setCredentials(prev => prev.filter(c => c.id !== id))
      
      // Also remove from localStorage to keep in sync
      const localCredentials = localStorage.getItem('jessCredentials')
      if (localCredentials) {
        const parsed = JSON.parse(localCredentials)
        const updated = parsed.filter((c: any) => c.id !== id)
        localStorage.setItem('jessCredentials', JSON.stringify(updated))
      }
      
      toast({
        title: "Success",
        description: "Credential deleted successfully from database.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete credential from database.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">All Credentials</h2>
        <p>Loading credentials from database...</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Credentials</h2>
      <CredentialsList 
        credentials={credentials}
        onDelete={handleDeleteCredential}
        onViewPDF={onViewPDF}
      />
    </div>
  )
}
