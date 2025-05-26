
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Award, Calendar, User, Briefcase, FileText, ExternalLink, Copy } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import Certificate from '@/components/Certificate'
import { useToast } from "@/hooks/use-toast"

export default function CredentialGenerator() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [issue, setIssue] = useState("")
  const [organization, setOrganization] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [credentialId, setCredentialId] = useState("")
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!name || !role || !organization) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }
    
    const newId = uuidv4().split('-')[0].toUpperCase()
    setCredentialId(newId)
    setSubmitted(true)
    
    toast({
      title: "Credential Generated!",
      description: "Your digital credential has been successfully created.",
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    })
  }

  const credentialUrl = `https://credentials.example.org/${credentialId}`

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="text-blue-600" />
              Credential Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User size={16} />
                Recipient Name *
              </Label>
              <Input 
                id="name"
                placeholder="Enter full name" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="flex items-center gap-2">
                <Briefcase size={16} />
                Organization *
              </Label>
              <Input 
                id="organization"
                placeholder="e.g., Journal of Advanced Research" 
                value={organization} 
                onChange={e => setOrganization(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <Award size={16} />
                Role/Achievement *
              </Label>
              <Input 
                id="role"
                placeholder="e.g., Peer Reviewer, Research Contributor" 
                value={role} 
                onChange={e => setRole(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar size={16} />
                Issue Date
              </Label>
              <Input 
                id="date"
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue" className="flex items-center gap-2">
                <FileText size={16} />
                Additional Details
              </Label>
              <Textarea 
                id="issue"
                placeholder="Journal issue, project details, or additional context" 
                value={issue} 
                onChange={e => setIssue(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
            >
              <Award className="mr-2" size={20} />
              Generate Credential
            </Button>
          </CardContent>
        </Card>

        {/* Certificate Preview */}
        {submitted && (
          <div className="space-y-6">
            <Certificate 
              name={name}
              role={role}
              organization={organization}
              date={date}
              issue={issue}
              credentialId={credentialId}
            />
          </div>
        )}
      </div>

      {/* Credential Details */}
      {submitted && (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
              <Award className="text-green-600" />
              Credential Generated Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="font-medium text-gray-700">Credential ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{credentialId}</code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(credentialId, "Credential ID")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="font-medium text-gray-700">Verification URL:</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(credentialUrl, "Verification URL")}
                    >
                      <Copy size={14} />
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={credentialUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">LinkedIn Integration</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Add this credential to your LinkedIn profile:
                </p>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Go to your LinkedIn profile</li>
                  <li>2. Click "Add profile section" → "Licenses & certifications"</li>
                  <li>3. Use the Credential ID and URL above</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
