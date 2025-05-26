
import { useState } from 'react'
import CredentialForm from './CredentialForm'
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

interface CredentialsTabProps {
  organizations: string[]
  roles: string[]
  credentials: Credential[]
  onCredentialGenerated: (credential: Credential) => void
  onDeleteCredential: (id: string) => void
  onViewPDF: (credential: Credential) => void
}

export default function CredentialsTab({ 
  organizations, 
  roles, 
  credentials, 
  onCredentialGenerated, 
  onDeleteCredential, 
  onViewPDF 
}: CredentialsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Manage Credentials</h2>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <CredentialForm 
          organizations={organizations}
          roles={roles}
          onCredentialGenerated={onCredentialGenerated}
        />
        
        <div>
          <CredentialsList 
            credentials={credentials}
            onDelete={onDeleteCredential}
            onViewPDF={onViewPDF}
          />
        </div>
      </div>
    </div>
  )
}
