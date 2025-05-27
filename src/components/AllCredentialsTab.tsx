
import CredentialsList from './CredentialsList'

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

interface AllCredentialsTabProps {
  credentials: Credential[]
  onDeleteCredential: (id: string) => void
  onViewPDF: (credential: Credential) => void
}

export default function AllCredentialsTab({ 
  credentials, 
  onDeleteCredential, 
  onViewPDF 
}: AllCredentialsTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Credentials</h2>
      <CredentialsList 
        credentials={credentials}
        onDelete={onDeleteCredential}
        onViewPDF={onViewPDF}
      />
    </div>
  )
}
