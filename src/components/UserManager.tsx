
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Plus } from 'lucide-react'

interface User {
  id: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

interface UserManagerProps {
  users: User[]
  setUsers: (users: User[]) => void
  currentUser: User
}

export default function UserManager({ users, setUsers, currentUser }: UserManagerProps) {
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editForm, setEditForm] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  })

  const startEdit = (user: User) => {
    setEditingUser(user.id)
    setEditForm({
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role
    })
  }

  const saveEdit = () => {
    if (editingUser) {
      const updated = users.map(user => 
        user.id === editingUser 
          ? { ...user, ...editForm }
          : user
      )
      setUsers(updated)
      localStorage.setItem('jessUsers', JSON.stringify(updated))
      setEditingUser(null)
    }
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setEditForm({ email: '', username: '', password: '', role: 'user' })
  }

  const addUser = () => {
    if (editForm.email && editForm.username && editForm.password) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: editForm.email,
        username: editForm.username,
        password: editForm.password,
        role: editForm.role,
        createdAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5)
      }
      const updated = [...users, newUser]
      setUsers(updated)
      localStorage.setItem('jessUsers', JSON.stringify(updated))
      setShowAddForm(false)
      setEditForm({ email: '', username: '', password: '', role: 'user' })
    }
  }

  const deleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own account")
      return
    }
    const updated = users.filter(user => user.id !== userId)
    setUsers(updated)
    localStorage.setItem('jessUsers', JSON.stringify(updated))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Management
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add User
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">Add New User</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
              <Input
                placeholder="Username"
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
              />
              <Input
                placeholder="Password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({...editForm, password: e.target.value})}
              />
              <Select 
                value={editForm.role} 
                onValueChange={(value: 'admin' | 'user') => setEditForm({...editForm, role: value})}
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                {editingUser === user.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editForm.password}
                        onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={editForm.role} 
                        onValueChange={(value: 'admin' | 'user') => setEditForm({...editForm, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>Save</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>•••••••••</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(user)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(user.id)}
                          disabled={user.id === currentUser.id}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
