
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
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

interface PDFViewerProps {
  credential: Credential | null
  isOpen: boolean
  onClose: () => void
}

export default function PDFViewer({ credential, isOpen, onClose }: PDFViewerProps) {
  if (!credential) return null

  const formattedDate = format(new Date(credential.date), 'MMMM dd, yyyy')
  const formattedExpiry = credential.expiry ? format(new Date(credential.expiry), 'MMMM dd, yyyy') : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Credential PDF View - ID: {credential.id}</DialogTitle>
        </DialogHeader>
        
        <Card className="bg-white border-2 border-gray-300 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Header */}
              <div className="border-b-2 border-blue-600 pb-4">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">
                  {credential.organization}
                </h1>
                <h2 className="text-xl font-semibold text-gray-700">
                  Digital Credential Certificate
                </h2>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <div className="text-lg">
                  <p className="mb-4">This is to certify that</p>
                  <p className="text-2xl font-bold text-blue-800 border-b border-gray-300 pb-2 mb-4">
                    {credential.name}
                  </p>
                  <p className="mb-4">has successfully served as</p>
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    {credential.role}
                  </p>
                  
                  {credential.issue && (
                    <p className="text-gray-700 mb-4">
                      {credential.issue}
                    </p>
                  )}

                  {!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 && (
                    <p className="text-gray-700 mb-4">
                      Contributing to: {credential.volumes.join(', ')}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="border rounded p-3">
                    <p className="font-semibold text-gray-600">Issue Date</p>
                    <p className="text-lg">{formattedDate}</p>
                  </div>
                  
                  {formattedExpiry && (
                    <div className="border rounded p-3">
                      <p className="font-semibold text-gray-600">Expiration Date</p>
                      <p className="text-lg">{formattedExpiry}</p>
                    </div>
                  )}
                </div>

                {/* Credential ID */}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Credential ID</p>
                  <p className="font-mono text-lg font-semibold">{credential.id}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Verify at: https://yourjournal.org/credentials/{credential.id}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-blue-600 pt-4 text-xs text-gray-500">
                <p>This digital credential is issued by {credential.organization}</p>
                <p>Generated on {format(new Date(), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
