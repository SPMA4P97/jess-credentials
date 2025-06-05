
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from 'lucide-react'
import UserTable from './UserTable'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

interface UsersTabProps {
  users: User[]
  setUsers: (users: User[]) => void
  currentUser: User
}

export default function UsersTab({ users, setUsers, currentUser }: UsersTabProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  })
  const { toast } = useToast()

  const addUser = async () => {
    if (newUserForm.username && newUserForm.password) {
      setIsAdding(true)
      
      try {
        // Insert new user into Supabase
        const { data, error } = await supabase
          .from('users')
          .insert([{
            email: newUserForm.email || null,
            username: newUserForm.username,
            password: newUserForm.password,
            role: newUserForm.role
          }])
          .select()

        if (error) {
          console.error('Error adding user to Supabase:', error)
          toast({
            title: "Error",
            description: "Failed to add user to database",
            variant: "destructive",
          })
          return
        }

        if (data && data[0]) {
          // Add to local state for immediate UI update
          const newUser: User = {
            id: data[0].id,
            email: data[0].email || '',
            username: data[0].username,
            password: data[0].password,
            role: (data[0].role === 'admin' || data[0].role === 'user') ? data[0].role : 'user',
            createdAt: data[0].created || new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5)
          }
          
          const updated = [...users, newUser]
          setUsers(updated)
          
          toast({
            title: "Success",
            description: "User added successfully",
          })
          
          setShowAddForm(false)
          setNewUserForm({ email: '', username: '', password: '', role: 'user' })
        }
      } catch (error) {
        console.error('Error adding user:', error)
        toast({
          title: "Error",
          description: "Failed to add user",
          variant: "destructive",
        })
      } finally {
        setIsAdding(false)
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Username and password are required",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Add User
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-4">Add New User</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Email (optional)"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
              disabled={isAdding}
            />
            <Input
              placeholder="Username *"
              value={newUserForm.username}
              onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})}
              disabled={isAdding}
            />
            <Input
              placeholder="Password *"
              type="password"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
              disabled={isAdding}
            />
            <Select 
              value={newUserForm.role} 
              onValueChange={(value: 'admin' | 'user') => setNewUserForm({...newUserForm, role: value})}
              disabled={isAdding}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={addUser} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add User"}
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isAdding}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <UserTable 
        users={users}
        setUsers={setUsers}
        currentUser={currentUser}
      />
    </div>
  )
}
