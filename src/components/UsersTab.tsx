
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from 'lucide-react'
import UserTable from './UserTable'

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
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  })

  const addUser = () => {
    if (newUserForm.email && newUserForm.username && newUserForm.password) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: newUserForm.email,
        username: newUserForm.username,
        password: newUserForm.password,
        role: newUserForm.role,
        createdAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5)
      }
      const updated = [...users, newUser]
      setUsers(updated)
      localStorage.setItem('jessUsers', JSON.stringify(updated))
      setShowAddForm(false)
      setNewUserForm({ email: '', username: '', password: '', role: 'user' })
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
              placeholder="Email"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
            />
            <Input
              placeholder="Username"
              value={newUserForm.username}
              onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})}
            />
            <Input
              placeholder="Password"
              type="password"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
            />
            <Select 
              value={newUserForm.role} 
              onValueChange={(value: 'admin' | 'user') => setNewUserForm({...newUserForm, role: value})}
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
            <Button onClick={addUser}>Add User</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
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
