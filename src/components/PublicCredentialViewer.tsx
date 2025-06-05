
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, FileText } from 'lucide-react'
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

interface PublicCredentialViewerProps {
  onBack: () => void
}

export default function PublicCredentialViewer({ onBack }: PublicCredentialViewerProps) {
  const [credentialId, setCredentialId] = useState("")
  const [lastName, setLastName] = useState("")
  const [foundCredential, setFoundCredential] = useState<Credential | null>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSearch = () => {
    const saved = localStorage.getItem('jessCredentials')
    if (saved) {
      const credentials: Credential[] = JSON.parse(saved)
      const credential = credentials.find(c => 
        c.id === credentialId && 
        c.name.toLowerCase().includes(lastName.toLowerCase())
      )
      
      if (credential) {
        setFoundCredential(credential)
        setError("")
        toast({
          title: "Credential found",
          description: "Your credential has been located successfully.",
        })
      } else {
        setError("Credential not found. Please check your ID and last name.")
        setFoundCredential(null)
      }
    } else {
      setError("No credentials found in the system.")
      setFoundCredential(null)
    }
  }

  const handleViewPDF = () => {
    if (!foundCredential) return

    const formattedDate = format(new Date(foundCredential.date), 'MMMM dd, yyyy')
    const formattedExpiry = foundCredential.expiry ? format(new Date(foundCredential.expiry), 'MMMM dd, yyyy') : null

    // Create a new window with the credential content for printing/saving as PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Digital Credential - ${foundCredential.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: white; }
            .certificate { max-width: 800px; margin: 0 auto; padding: 60px; border: 3px solid #2563eb; background: white; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 30px; margin-bottom: 40px; }
            .org-name { font-size: 36px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .cert-title { font-size: 24px; font-weight: 600; color: #374151; }
            .content { text-align: center; font-size: 18px; line-height: 1.6; }
            .recipient-name { font-size: 42px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #d1d5db; padding-bottom: 15px; margin: 30px 0; }
            .role { font-size: 32px; font-weight: 600; color: #374151; margin: 30px 0; }
            .dates { display: flex; justify-content: space-around; margin: 40px 0; font-size: 12px; }
            .date-box { border: 1px solid #d1d5db; padding: 10px; border-radius: 8px; }
            .credential-id { border-top: 3px solid #2563eb; padding-top: 20px; margin-top: 30px; font-size: 10px; }
            .footer { border-top: 3px solid #2563eb; padding-top: 20px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="org-name">${foundCredential.organization}</div>
              <div class="cert-title">Digital Credential Certificate</div>
            </div>
            <div class="content">
              <p>This is to certify that</p>
              <div class="recipient-name">${foundCredential.name}</div>
              <p>has successfully served as</p>
              <div class="role">${foundCredential.role}</div>
              ${foundCredential.issue ? `<p style="color: #374151; margin: 20px 0; font-size: 16px;">${foundCredential.issue}</p>` : ''}
              ${!foundCredential.hideVolumes && foundCredential.volumes && foundCredential.volumes.length > 0 ? 
                `<p style="color: #374151; margin: 20px 0; font-size: 16px;">Contributing to: ${foundCredential.volumes.join(', ')}</p>` : ''}
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
                <div style="font-family: monospace; font-size: 12px; font-weight: 600;">${foundCredential.id}</div>
                <div style="font-size: 8px; color: #6b7280; margin-top: 5px;">
                  Verify at: ${window.location.origin}/?credentialId=${foundCredential.id}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This digital credential is issued by ${foundCredential.organization}</p>
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto shadow-xl">
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
            </Button>
            <div className="text-center space-y-2 flex-1">
              <h1 className="text-2xl font-bold text-blue-800">View Your Credential</h1>
              <p className="text-gray-600">Enter your details to access your credential</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Input 
              placeholder="Credential ID" 
              value={credentialId} 
              onChange={e => setCredentialId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center"
            />
            <Input 
              placeholder="Last Name" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center"
            />
            <Button onClick={handleSearch} className="w-full">View Credential</Button>
            
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>

          {foundCredential && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Credential Found</h3>
              <div className="space-y-1 text-sm text-green-700">
                <p><strong>Name:</strong> {foundCredential.name}</p>
                <p><strong>Role:</strong> {foundCredential.role}</p>
                <p><strong>Organization:</strong> {foundCredential.organization}</p>
                <p><strong>Issue Date:</strong> {foundCredential.issue}</p>
                <p><strong>Expiry Date:</strong> {foundCredential.expiry}</p>
                <p><strong>ID:</strong> {foundCredential.id}</p>
              </div>
              <Button 
                onClick={handleViewPDF} 
                className="w-full mt-3 flex items-center justify-center gap-2"
                variant="outline"
              >
                <FileText size={16} />
                View PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
