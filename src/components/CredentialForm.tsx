
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { Calendar } from 'lucide-react'

interface CredentialFormProps {
  organizations: string[]
  onCredentialGenerated: (credential: any) => void
}

const volumes = [
  "Volume 1", "Volume 2", "Volume 3", "Volume 4", "Volume 5",
  "Volume 6", "Volume 7", "Volume 8", "Volume 9", "Volume 10",
  "Volume 11", "Volume 12", "Volume 13", "Volume 14", "Volume 15"
]

export default function CredentialForm({ organizations, onCredentialGenerated }: CredentialFormProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [issue, setIssue] = useState("")
  const [expiry, setExpiry] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("")
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([])
  const [hideVolumes, setHideVolumes] = useState(false)

  const handleSetYearDates = () => {
    const currentYear = new Date().getFullYear()
    const startOfYear = `${currentYear}-01-01`
    const endOfYear = `${currentYear}-12-31`
    
    setDate(startOfYear)
    setExpiry(endOfYear)
  }

  const handleVolumeChange = (volume: string, checked: boolean) => {
    if (checked) {
      setSelectedVolumes([...selectedVolumes, volume])
    } else {
      setSelectedVolumes(selectedVolumes.filter(v => v !== volume))
    }
  }

  const handleGenerate = () => {
    const newId = uuidv4().split('-')[0]
    const newCredential = {
      id: newId,
      name,
      role,
      organization: selectedOrganization,
      date,
      issue,
      expiry,
      volumes: hideVolumes ? [] : selectedVolumes,
      hideVolumes
    }
    
    onCredentialGenerated(newCredential)
    
    // Reset form
    setName("")
    setRole("")
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setIssue("")
    setExpiry("")
    setSelectedOrganization("")
    setSelectedVolumes([])
    setHideVolumes(false)
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Issue Date</h3>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Expiration Date</h3>
              <Input type="date" placeholder="Expiry Date (optional)" value={expiry} onChange={e => setExpiry(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={handleSetYearDates} variant="outline" className="flex items-center gap-2">
              <Calendar size={16} />
              Set Current Year Dates
            </Button>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id="hide-volumes" 
                checked={hideVolumes} 
                onCheckedChange={(checked) => setHideVolumes(checked === true)}
              />
              <label htmlFor="hide-volumes" className="text-sm font-medium">
                Hide volumes from credential
              </label>
            </div>
            
            {!hideVolumes && (
              <div>
                <h3 className="text-sm font-medium mb-2">Select Volume(s)</h3>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {volumes.map(volume => (
                    <div key={volume} className="flex items-center space-x-2">
                      <Checkbox 
                        id={volume}
                        checked={selectedVolumes.includes(volume)}
                        onCheckedChange={(checked) => handleVolumeChange(volume, checked === true)}
                      />
                      <label htmlFor={volume} className="text-xs">
                        {volume}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Textarea placeholder="Journal Issue or Description" value={issue} onChange={e => setIssue(e.target.value)} />
        </div>

        <Button onClick={handleGenerate}>Generate Credential</Button>
      </CardContent>
    </Card>
  )
}
