
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
  const publicUrl = `${window.location.origin}/credential/${credential.id}`

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
            body { font-family: Arial, sans-serif; margin: 0; background: white; }
            .certificate { 
              width: 11in; 
              height: 8.5in; 
              margin: 0 auto; 
              padding: 60px; 
              border: 3px solid #2563eb; 
              background: white; 
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 30px; margin-bottom: 40px; }
            .org-name { font-size: 48px; font-weight: bold; color: #1e40af; margin-bottom: 15px; }
            .cert-title { font-size: 32px; font-weight: 600; color: #374151; }
            .content { text-align: center; font-size: 24px; line-height: 1.6; flex-grow: 1; }
            .recipient-name { font-size: 60px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #d1d5db; padding-bottom: 20px; margin: 40px 0; }
            .role { font-size: 40px; font-weight: 600; color: #374151; margin: 40px 0; }
            .dates { display: flex; ${formattedExpiry ? 'justify-content: space-around' : 'justify-content: center'}; margin: 40px 0; font-size: 16px; }
            .date-box { border: 2px solid #d1d5db; padding: 15px; border-radius: 12px; min-width: 200px; }
            .credential-id { border-top: 3px solid #2563eb; padding-top: 20px; margin-top: 30px; font-size: 14px; }
            .public-url { margin-top: 15px; font-size: 12px; color: #2563eb; word-break: break-all; }
            .footer { border-top: 3px solid #2563eb; padding-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
            @media print { 
              body { margin: 0; } 
              .certificate { margin: 0; }
            }
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
              ${credential.issue ? `<p style="color: #374151; margin: 30px 0; font-size: 20px;">${credential.issue}</p>` : ''}
              ${!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 ? 
                `<p style="color: #374151; margin: 30px 0; font-size: 20px;">Contributing to: ${credential.volumes.join(', ')}</p>` : ''}
              <div class="dates">
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Issue Date</div>
                  <div style="font-size: 18px; margin-top: 5px;">${formattedDate}</div>
                </div>
                ${formattedExpiry ? `
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Expiration Date</div>
                  <div style="font-size: 18px; margin-top: 5px;">${formattedExpiry}</div>
                </div>` : ''}
              </div>
              <div class="credential-id">
                <div style="font-weight: 600; color: #374151;">Credential ID</div>
                <div style="font-family: monospace; font-size: 16px; font-weight: 600; margin-top: 5px;">${credential.id}</div>
                <div class="public-url">
                  Verify at: ${publicUrl}
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Credential PDF View - ID: {credential.id}</DialogTitle>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download size={16} />
            Download PDF
          </Button>
        </DialogHeader>
        
        {/* Certificate in landscape orientation matching the public page */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg" style={{ aspectRatio: '11/8.5', minHeight: '600px' }}>
          <div className="h-full p-12 flex flex-col justify-between">
            <div className="text-center space-y-8">
              {/* Header */}
              <div className="border-b-2 border-blue-600 pb-6">
                <h1 className="text-4xl font-bold text-blue-800 mb-3">
                  {credential.organization}
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700">
                  Digital Credential Certificate
                </h2>
              </div>

              {/* Main Content */}
              <div className="space-y-8">
                <div className="text-xl">
                  <p className="mb-6">This is to certify that</p>
                  <p className="text-5xl font-bold text-blue-800 border-b border-gray-300 pb-4 mb-8">
                    {credential.name}
                  </p>
                  <p className="mb-6">has successfully served as</p>
                  <p className="text-3xl font-semibold text-gray-800 mb-8">
                    {credential.role}
                  </p>
                  
                  {credential.issue && (
                    <p className="text-gray-700 mb-6 text-lg">
                      {credential.issue}
                    </p>
                  )}

                  {!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 && (
                    <p className="text-gray-700 mb-6 text-lg">
                      Contributing to: {credential.volumes.join(', ')}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className={`grid ${formattedExpiry ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 place-items-center'} gap-6`}>
                  <div className="border rounded-lg p-4">
                    <p className="font-semibold text-gray-600 text-sm">Issue Date</p>
                    <p className="text-lg">{formattedDate}</p>
                  </div>
                  
                  {formattedExpiry && (
                    <div className="border rounded-lg p-4">
                      <p className="font-semibold text-gray-600 text-sm">Expiration Date</p>
                      <p className="text-lg">{formattedExpiry}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-4">
              {/* Credential ID */}
              <div className="border-t pt-4 text-center">
                <p className="text-sm text-gray-600">Credential ID</p>
                <p className="font-mono text-lg font-semibold">{credential.id}</p>
              </div>

              {/* Public URL for easy copying */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Verify this credential at:</p>
                <p className="font-mono text-sm text-blue-600 break-all border rounded p-2 bg-gray-50">
                  {publicUrl}
                </p>
              </div>

              {/* Organization footer */}
              <div className="border-t-2 border-blue-600 pt-3 text-center">
                <p className="text-xs text-gray-500">This digital credential is issued by {credential.organization}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
