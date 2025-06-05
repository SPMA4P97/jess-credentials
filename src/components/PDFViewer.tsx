
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
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

  const handleDownloadPDF = () => {
    // Create a new window with the credential content for printing/saving as PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Digital Credential - ${credential.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: white; }
            .certificate { max-width: 800px; margin: 0 auto; padding: 60px; border: 3px solid #2563eb; background: white; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 30px; margin-bottom: 40px; }
            .org-name { font-size: 36px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .cert-title { font-size: 24px; font-weight: 600; color: #374151; }
            .content { text-align: center; font-size: 18px; line-height: 1.6; }
            .recipient-name { font-size: 42px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #d1d5db; padding-bottom: 15px; margin: 30px 0; }
            .role { font-size: 32px; font-weight: 600; color: #374151; margin: 30px 0; }
            .dates { display: flex; ${formattedExpiry ? 'justify-content: space-around' : 'justify-content: center'}; margin: 40px 0; font-size: 12px; }
            .date-box { border: 1px solid #d1d5db; padding: 10px; border-radius: 8px; }
            .credential-id { border-top: 3px solid #2563eb; padding-top: 20px; margin-top: 30px; font-size: 10px; }
            .footer { border-top: 3px solid #2563eb; padding-top: 20px; margin-top: 30px; font-size: 8px; color: #6b7280; text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="org-name">${credential.organization}</div>
              <div class="cert-title">Digital Credential Certificate</div>
            </div>
            <div class="content">
              <p>This is to certify that</p>
              <div class="recipient-name">${credential.name}</div>
              <p>has successfully served as</p>
              <div class="role">${credential.role}</div>
              ${credential.issue ? `<p style="color: #374151; margin: 20px 0; font-size: 16px;">${credential.issue}</p>` : ''}
              ${!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 ? 
                `<p style="color: #374151; margin: 20px 0; font-size: 16px;">Contributing to: ${credential.volumes.join(', ')}</p>` : ''}
              <div class="dates">
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Issue Date</div>
                  <div style="font-size: 14px;">${formattedDate}</div>
                </div>
                ${formattedExpiry ? `
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Expiration Date</div>
                  <div style="font-size: 14px;">${formattedExpiry}</div>
                </div>` : ''}
              </div>
              <div class="credential-id">
                <div style="font-weight: 600; color: #374151;">Credential ID</div>
                <div style="font-family: monospace; font-size: 12px; font-weight: 600;">${credential.id}</div>
                <div style="font-size: 6px; color: #6b7280; margin-top: 5px;">
                  Verify at: ${window.location.origin}/?credentialId=${credential.id}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This digital credential is issued by ${credential.organization}</p>
              <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Credential PDF View - ID: {credential.id}</DialogTitle>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download size={16} />
            Download PDF
          </Button>
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
                  <p className="text-4xl font-bold text-blue-800 border-b border-gray-300 pb-3 mb-6">
                    {credential.name}
                  </p>
                  <p className="mb-4">has successfully served as</p>
                  <p className="text-2xl font-semibold text-gray-800 mb-6">
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

                {/* Dates - Centered when no expiry */}
                <div className={`grid ${formattedExpiry ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 place-items-center'} gap-4 text-xs`}>
                  <div className="border rounded p-2">
                    <p className="font-semibold text-gray-600 text-xs">Issue Date</p>
                    <p className="text-sm">{formattedDate}</p>
                  </div>
                  
                  {formattedExpiry && (
                    <div className="border rounded p-2">
                      <p className="font-semibold text-gray-600 text-xs">Expiration Date</p>
                      <p className="text-sm">{formattedExpiry}</p>
                    </div>
                  )}
                </div>

                {/* Credential ID */}
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-600">Credential ID</p>
                  <p className="font-mono text-sm font-semibold">{credential.id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Verify at: https://yourjournal.org/credentials/{credential.id}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-blue-600 pt-3 text-xs text-gray-500">
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
