
import CredentialForm from './CredentialForm'

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

interface CredentialsTabProps {
  organizations: string[]
  roles: string[]
  onCredentialGenerated: (credential: Credential) => void
}

export default function CredentialsTab({ 
  organizations, 
  roles, 
  onCredentialGenerated
}: CredentialsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Create New Credential</h2>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <CredentialForm 
            organizations={organizations}
            roles={roles}
            onCredentialGenerated={onCredentialGenerated}
          />
        </div>
      </div>
    </div>
  )
}
