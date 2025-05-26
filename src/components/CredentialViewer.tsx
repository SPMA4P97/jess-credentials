
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { Download } from 'lucide-react'

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

interface CredentialViewerProps {
  id: string
}

export default function CredentialViewer({ id }: CredentialViewerProps) {
  const [credentials] = useState<Credential[]>(() => {
    const savedCredentials = localStorage.getItem('jessCredentials')
    return savedCredentials ? JSON.parse(savedCredentials) : []
  })

  const credential = credentials.find(c => c.id === id)

  const handleDownloadPDF = () => {
    // Create a new window with the credential content for printing/saving as PDF
    const printWindow = window.open('', '_blank')
    if (printWindow && credential) {
      const formattedDate = format(new Date(credential.date), 'MMMM dd, yyyy')
      const formattedExpiry = credential.expiry ? format(new Date(credential.expiry), 'MMMM dd, yyyy') : null

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
            .recipient-name { font-size: 32px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #d1d5db; padding-bottom: 10px; margin: 20px 0; }
            .role { font-size: 24px; font-weight: 600; color: #374151; margin: 20px 0; }
            .dates { display: flex; justify-content: space-around; margin: 40px 0; font-size: 14px; }
            .date-box { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; }
            .credential-id { border-top: 3px solid #2563eb; padding-top: 30px; margin-top: 40px; }
            .footer { border-top: 3px solid #2563eb; padding-top: 30px; margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; }
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
              ${credential.issue ? `<p style="color: #374151; margin: 20px 0;">${credential.issue}</p>` : ''}
              ${!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 ? 
                `<p style="color: #374151; margin: 20px 0;">Contributing to: ${credential.volumes.join(', ')}</p>` : ''}
              <div class="dates">
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Issue Date</div>
                  <div style="font-size: 18px;">${formattedDate}</div>
                </div>
                ${formattedExpiry ? `
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Expiration Date</div>
                  <div style="font-size: 18px;">${formattedExpiry}</div>
                </div>` : ''}
              </div>
              <div class="credential-id">
                <div style="font-weight: 600; color: #374151; font-size: 14px;">Credential ID</div>
                <div style="font-family: monospace; font-size: 18px; font-weight: 600;">${credential.id}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">
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

  if (!credential) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Credential Not Found</h2>
            <p className="text-gray-600">The credential with ID <strong>{id}</strong> could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedDate = format(new Date(credential.date), 'MMMM dd, yyyy')
  const formattedExpiry = credential.expiry ? format(new Date(credential.expiry), 'MMMM dd, yyyy') : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-end">
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download size={16} />
            Download PDF
          </Button>
        </div>
        
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
                    Verify at: {window.location.origin}/?credentialId={credential.id}
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
      </div>
    </div>
  )
}
