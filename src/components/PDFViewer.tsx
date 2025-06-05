
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
            @page { 
              size: 11in 8.5in landscape; 
              margin: 0.5in; 
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              background: white; 
              color: black;
            }
            .certificate { 
              width: 10in; 
              height: 7.5in; 
              margin: 0 auto; 
              padding: 60px; 
              border: 3px solid black; 
              background: white; 
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid black; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .org-name { 
              font-size: 48px; 
              font-weight: bold; 
              color: black; 
              margin-bottom: 10px; 
            }
            .cert-title { 
              font-size: 28px; 
              font-weight: 600; 
              color: black; 
            }
            .content { 
              text-align: center; 
              font-size: 20px; 
              line-height: 1.4; 
              flex-grow: 1; 
            }
            .recipient-name { 
              font-size: 60px; 
              font-weight: bold; 
              color: black; 
              border-bottom: 2px solid black; 
              padding-bottom: 15px; 
              margin: 25px 0; 
            }
            .role { 
              font-size: 36px; 
              font-weight: 600; 
              color: black; 
              margin: 25px 0; 
            }
            .info { 
              color: black; 
              margin: 20px 0; 
              font-size: 18px; 
              line-height: 1.4;
            }
            .dates { 
              display: flex; 
              ${formattedExpiry ? 'justify-content: space-around' : 'justify-content: center'}; 
              margin: 30px 0; 
              font-size: 16px; 
              max-width: 600px;
              margin-left: auto;
              margin-right: auto;
            }
            .date-box { 
              border: 2px solid black; 
              padding: 15px; 
              border-radius: 8px; 
              min-width: 180px; 
              text-align: center;
            }
            .date-label {
              font-weight: 600; 
              color: black; 
              font-size: 14px;
              margin-bottom: 5px;
            }
            .date-value {
              font-size: 18px; 
              color: black;
            }
            .footer { 
              margin-top: 20px;
            }
            .credential-id { 
              border-top: 2px solid black; 
              padding-top: 15px; 
              margin-bottom: 15px; 
              font-size: 14px; 
              text-align: center;
            }
            .public-url { 
              margin: 10px 0; 
              font-size: 12px; 
              color: black; 
              word-break: break-all; 
              text-align: center;
              border: 1px solid black;
              padding: 8px;
              border-radius: 4px;
              background: white;
              max-width: 800px;
              margin-left: auto;
              margin-right: auto;
            }
            .org-footer { 
              border-top: 3px solid black; 
              padding-top: 15px; 
              font-size: 12px; 
              color: black; 
              text-align: center; 
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
              ${credential.issue ? `<div class="info">${credential.issue}</div>` : ''}
              ${!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 ? 
                `<div class="info">Contributing to: ${credential.volumes.join(', ')}</div>` : ''}
              <div class="dates">
                <div class="date-box">
                  <div class="date-label">Issue Date</div>
                  <div class="date-value">${formattedDate}</div>
                </div>
                ${formattedExpiry ? `
                <div class="date-box">
                  <div class="date-label">Expiration Date</div>
                  <div class="date-value">${formattedExpiry}</div>
                </div>` : ''}
              </div>
            </div>
            <div class="footer">
              <div class="credential-id">
                <div style="font-weight: 600; margin-bottom: 5px;">Credential ID</div>
                <div style="font-family: monospace; font-size: 16px; font-weight: 600;">${credential.id}</div>
              </div>
              <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 12px; margin-bottom: 5px;">Verify this credential at:</div>
                <div class="public-url">${publicUrl}</div>
              </div>
              <div class="org-footer">
                <p>This digital credential is issued by ${credential.organization}</p>
              </div>
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
        
        {/* Certificate matching the exact design of PublicCredential.tsx */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg" style={{ width: '100%', maxWidth: '1056px', height: '816px', margin: '0 auto' }}>
          <div className="h-full p-12 flex flex-col justify-between text-black">
            <div className="text-center space-y-4">
              {/* Header */}
              <div className="border-b-2 border-blue-600 pb-4">
                <h2 className="text-4xl font-bold text-blue-800 mb-2">
                  {credential.organization}
                </h2>
                <h3 className="text-2xl font-semibold text-gray-700">
                  Digital Credential Certificate
                </h3>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <div className="text-lg">
                  <p className="mb-3">This is to certify that</p>
                  <p className="text-5xl font-bold text-blue-800 border-b border-gray-300 pb-3 mb-4">
                    {credential.name}
                  </p>
                  <p className="mb-3">has successfully served as</p>
                  <p className="text-3xl font-semibold text-gray-800 mb-4">
                    {credential.role}
                  </p>
                  
                  {credential.issue && (
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">
                      {credential.issue}
                    </p>
                  )}

                  {!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 && (
                    <p className="text-gray-700 mb-4 text-base">
                      Contributing to: {credential.volumes.join(', ')}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className={`grid ${formattedExpiry ? 'grid-cols-2' : 'grid-cols-1 place-items-center'} gap-6 max-w-2xl mx-auto`}>
                  <div className="border rounded-lg p-3">
                    <p className="font-semibold text-gray-600 text-sm">Issue Date</p>
                    <p className="text-lg">{formattedDate}</p>
                  </div>
                  
                  {formattedExpiry && (
                    <div className="border rounded-lg p-3">
                      <p className="font-semibold text-gray-600 text-sm">Expiration Date</p>
                      <p className="text-lg">{formattedExpiry}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-3">
              {/* Credential ID */}
              <div className="border-t pt-3 text-center">
                <p className="text-sm text-gray-600">Credential ID</p>
                <p className="font-mono text-base font-semibold">{credential.id}</p>
              </div>

              {/* Public URL for easy copying */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Verify this credential at:</p>
                <p className="font-mono text-xs text-blue-600 break-all border rounded p-2 bg-gray-50 max-w-4xl mx-auto">
                  {publicUrl}
                </p>
              </div>

              {/* Organization footer */}
              <div className="border-t-2 border-blue-600 pt-2 text-center">
                <p className="text-xs text-gray-500">This digital credential is issued by {credential.organization}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
