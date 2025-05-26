
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Credential {
  id: string
  name: string
  role: string
  organization: string
  date: string
  issue: string
  expiry: string
}

interface CredentialResultDialogProps {
  credential: Credential | null
  isOpen: boolean
  onClose: () => void
}

export default function CredentialResultDialog({ credential, isOpen, onClose }: CredentialResultDialogProps) {
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
          <p><strong>Journal Info:</strong> {credential.issue}</p>
          <p><strong>Credential ID:</strong> {credential.id}</p>
          <p><strong>Credential URL:</strong> https://yourjournal.org/credentials/{credential.id}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
