
import { Button } from "@/components/ui/button"
import { FileText } from 'lucide-react'
import { format } from 'date-fns'

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

interface CredentialDisplayProps {
  credential: Credential
  onViewPDF: () => void
}

export default function CredentialDisplay({ credential, onViewPDF }: CredentialDisplayProps) {
  return (
    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
      <h3 className="font-semibold text-green-800 mb-2">Credential Found</h3>
      <div className="space-y-1 text-sm text-green-700">
        <p><strong>Name:</strong> {credential.name}</p>
        <p><strong>Role:</strong> {credential.role}</p>
        <p><strong>Organization:</strong> {credential.organization}</p>
        <p><strong>Issue Date:</strong> {credential.issue}</p>
        <p><strong>Expiry Date:</strong> {credential.expiry}</p>
        <p><strong>ID:</strong> {credential.id}</p>
      </div>
      <Button 
        onClick={onViewPDF} 
        className="w-full mt-3 flex items-center justify-center gap-2"
        variant="outline"
      >
        <FileText size={16} />
        View PDF
      </Button>
    </div>
  )
}
