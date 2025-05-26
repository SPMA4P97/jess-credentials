
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from 'lucide-react'

interface OrganizationManagerProps {
  organizations: string[]
  setOrganizations: (orgs: string[]) => void
}

export default function OrganizationManager({ organizations, setOrganizations }: OrganizationManagerProps) {
  const [newOrg, setNewOrg] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const addOrganization = () => {
    if (newOrg.trim() && !organizations.includes(newOrg.trim())) {
      const updated = [...organizations, newOrg.trim()]
      setOrganizations(updated)
      localStorage.setItem('jessOrganizations', JSON.stringify(updated))
      setNewOrg('')
    }
  }

  const deleteOrganization = (index: number) => {
    const updated = organizations.filter((_, i) => i !== index)
    setOrganizations(updated)
    localStorage.setItem('jessOrganizations', JSON.stringify(updated))
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(organizations[index])
  }

  const saveEdit = () => {
    if (editValue.trim() && editingIndex !== null) {
      const updated = [...organizations]
      updated[editingIndex] = editValue.trim()
      setOrganizations(updated)
      localStorage.setItem('jessOrganizations', JSON.stringify(updated))
      setEditingIndex(null)
      setEditValue('')
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditValue('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new organization"
              value={newOrg}
              onChange={(e) => setNewOrg(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOrganization()}
            />
            <Button onClick={addOrganization}>Add</Button>
          </div>
          
          <div className="space-y-2">
            {organizations.map((org, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                {editingIndex === index ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={saveEdit}>Save</Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 cursor-pointer" onClick={() => startEdit(index)}>
                      {org}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteOrganization(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
