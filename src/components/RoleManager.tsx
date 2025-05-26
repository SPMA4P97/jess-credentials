
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from 'lucide-react'

interface RoleManagerProps {
  roles: string[]
  setRoles: (roles: string[]) => void
}

export default function RoleManager({ roles, setRoles }: RoleManagerProps) {
  const [newRole, setNewRole] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      const updated = [...roles, newRole.trim()]
      setRoles(updated)
      localStorage.setItem('jessRoles', JSON.stringify(updated))
      setNewRole('')
    }
  }

  const deleteRole = (index: number) => {
    const updated = roles.filter((_, i) => i !== index)
    setRoles(updated)
    localStorage.setItem('jessRoles', JSON.stringify(updated))
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(roles[index])
  }

  const saveEdit = () => {
    if (editValue.trim() && editingIndex !== null) {
      const updated = [...roles]
      updated[editingIndex] = editValue.trim()
      setRoles(updated)
      localStorage.setItem('jessRoles', JSON.stringify(updated))
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
        <CardTitle>Available Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addRole()}
            />
            <Button onClick={addRole}>Add</Button>
          </div>
          
          <div className="space-y-2">
            {roles.map((role, index) => (
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
                      {role}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRole(index)}
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
