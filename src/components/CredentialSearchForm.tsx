
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CredentialSearchFormProps {
  onSearch: (credentialId: string, lastName: string) => void
}

export default function CredentialSearchForm({ onSearch }: CredentialSearchFormProps) {
  const [credentialId, setCredentialId] = useState("")
  const [lastName, setLastName] = useState("")

  const handleSearch = () => {
    onSearch(credentialId, lastName)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
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
    </div>
  )
}
