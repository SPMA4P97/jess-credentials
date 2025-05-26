
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
  roles: string[]
  onCredentialGenerated: (credential: any) => void
}

export default function CredentialForm({ organizations, roles, onCredentialGenerated }: CredentialFormProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [issue, setIssue] = useState("")
  const [expiry, setExpiry] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("")
  const [volumesInput, setVolumesInput] = useState("")
  const [hideVolumes, setHideVolumes] = useState(false)
  const [customYear, setCustomYear] = useState(new Date().getFullYear().toString())

  const handleSetYearDates = () => {
    const year = parseInt(customYear)
    if (isNaN(year) || year < 1900 || year > 2100) {
      return
    }
    const startOfYear = `${year}-01-01`
    const endOfYear = `${year}-12-31`
    
    setDate(startOfYear)
    setExpiry(endOfYear)
  }

  const parseVolumes = (input: string): string[] => {
    if (!input.trim()) return []
    
    // Split by comma and clean up each volume
    return input.split(',')
      .map(vol => vol.trim())
      .filter(vol => vol.length > 0)
      .map(vol => {
        // If it's just a number, format as "Volume X"
        if (/^\d+$/.test(vol)) {
          return `Volume ${vol}`
        }
        // If it already starts with "Volume", keep as is
        if (vol.toLowerCase().startsWith('volume')) {
          return vol
        }
        // Otherwise, prepend "Volume "
        return `Volume ${vol}`
      })
  }

  const handleGenerate = () => {
    const newId = uuidv4().split('-')[0]
    const volumes = parseVolumes(volumesInput)
    
    const newCredential = {
      id: newId,
      name,
      role,
      organization: selectedOrganization,
      date,
      issue,
      expiry,
      volumes: hideVolumes ? [] : volumes,
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
    setVolumesInput("")
    setHideVolumes(false)
    setCustomYear(new Date().getFullYear().toString())
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
          
          <div>
            <h3 className="text-sm font-medium mb-2">Role</h3>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Year</h3>
              <Input 
                type="number" 
                min="1900" 
                max="2100" 
                value={customYear} 
                onChange={e => setCustomYear(e.target.value)}
                placeholder="Enter any year"
              />
            </div>
            <Button 
              type="button" 
              onClick={handleSetYearDates} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-xs px-2 py-1 h-8"
            >
              <Calendar size={12} />
              Set as Full Year
            </Button>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id="hide-volumes" 
                checked={hideVolumes} 
                onCheckedChange={(checked) => {
                  if (checked === "indeterminate") return
                  setHideVolumes(checked)
                }}
              />
              <label htmlFor="hide-volumes" className="text-sm font-medium">
                Hide volumes from credential
              </label>
            </div>
            
            {!hideVolumes && (
              <div>
                <h3 className="text-sm font-medium mb-2">Volume(s)</h3>
                <Input 
                  placeholder="Enter volumes (e.g., 1, 2, 3 or Volume 1, Volume 2)" 
                  value={volumesInput} 
                  onChange={e => setVolumesInput(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple volumes with commas. Numbers will be formatted as "Volume X"
                </p>
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
