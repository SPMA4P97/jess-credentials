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
  const [volumesInput, setVolumesInput] = useState("")
  const [hideVolumes, setHideVolumes] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const handleSetYearDates = () => {
    const year = parseInt(selectedYear)
    const startOfYear = `${year}-01-01`
    const endOfYear = `${year}-12-31`
    
    setDate(startOfYear)
    setExpiry(endOfYear)
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear + 5; year >= currentYear - 20; year--) {
      years.push(year.toString())
    }
    return years
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
    setSelectedYear(new Date().getFullYear().toString())
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

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Select Year</h3>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {generateYearOptions().map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={handleSetYearDates} variant="outline" className="flex items-center gap-2">
              <Calendar size={16} />
              Set Year Dates
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
