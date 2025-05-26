
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText } from 'lucide-react'

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

interface CredentialResultDialogProps {
  credential: Credential | null
  isOpen: boolean
  onClose: () => void
  onViewPDF: (credential: Credential) => void
}

export default function CredentialResultDialog({ credential, isOpen, onClose, onViewPDF }: CredentialResultDialogProps) {
  if (!credential) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Credential Generated Successfully</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Organization:</strong> {credential.organization}</p>
          <p><strong>Name:</strong> {credential.name}</p>
          <p><strong>Role:</strong> {credential.role}</p>
          <p><strong>Issue Date:</strong> {credential.date}</p>
          <p><strong>Expiration Date:</strong> {credential.expiry || 'None'}</p>
          {!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 && (
            <p><strong>Volumes:</strong> {credential.volumes.join(', ')}</p>
          )}
          <p><strong>Journal Info:</strong> {credential.issue}</p>
          <p><strong>Credential ID:</strong> {credential.id}</p>
          <p><strong>Credential URL:</strong> https://yourjournal.org/credentials/{credential.id}</p>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => onViewPDF(credential)} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              View PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
