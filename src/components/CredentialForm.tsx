
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

interface CredentialFormProps {
  organizations: string[]
  onCredentialGenerated: (credential: any) => void
}

export default function CredentialForm({ organizations, onCredentialGenerated }: CredentialFormProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [issue, setIssue] = useState("")
  const [expiry, setExpiry] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("")

  const handleGenerate = () => {
    const newId = uuidv4().split('-')[0]
    const newCredential = {
      id: newId,
      name,
      role,
      organization: selectedOrganization,
      date,
      issue,
      expiry
    }
    
    onCredentialGenerated(newCredential)
    
    // Reset form
    setName("")
    setRole("")
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setIssue("")
    setExpiry("")
    setSelectedOrganization("")
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Credential Generator</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Issuing Organization</h3>
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger>
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input placeholder="Recipient Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Role (e.g., Peer Reviewer)" value={role} onChange={e => setRole(e.target.value)} />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Issue Date</h3>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Expiration Date</h3>
            <Input type="date" placeholder="Expiry Date (optional)" value={expiry} onChange={e => setExpiry(e.target.value)} />
          </div>
          
          <Textarea placeholder="Journal Issue or Description" value={issue} onChange={e => setIssue(e.target.value)} />
        </div>

        <Button onClick={handleGenerate}>Generate Credential</Button>
      </CardContent>
    </Card>
  )
}
