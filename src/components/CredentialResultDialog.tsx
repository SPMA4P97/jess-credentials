
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Copy } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
  
  if (!credential) return null

  const credentialURL = `${window.location.origin}/?credentialId=${credential.id}`

  const handleCopyURL = () => {
    navigator.clipboard.writeText(credentialURL)
    toast({
      title: "URL Copied",
      description: "Credential URL has been copied to clipboard",
    })
  }

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
          
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm font-medium mb-2">Public Credential URL:</p>
            <div className="flex gap-2">
              <code className="flex-1 text-xs bg-white p-2 rounded border break-all">
                {credentialURL}
              </code>
              <Button onClick={handleCopyURL} variant="outline" size="sm">
                <Copy size={14} />
              </Button>
            </div>
          </div>
          
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
