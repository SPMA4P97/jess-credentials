import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Edit2, Check, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

interface User {
  id: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

interface UserManagementProps {
  users: User[]
  setUsers: (users: User[]) => void
  currentUser: User
  organizations: string[]
  setOrganizations: (organizations: string[]) => void
  roles: string[]
  setRoles: (roles: string[]) => void
}

export default function UserManagement({ 
  users, 
  setUsers, 
  currentUser, 
  organizations, 
  setOrganizations, 
  roles, 
  setRoles 
}: UserManagementProps) {
  const [newEmail, setNewEmail] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user')
  const [newOrganization, setNewOrganization] = useState("")
  const [newCredentialRole, setNewCredentialRole] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'username' | 'password' | null>(null)
  const [editValue, setEditValue] = useState("")
  const { toast } = useToast()

  const handleCreateUser = () => {
    if (!newEmail || !newUsername || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (users.find(u => u.email === newEmail)) {
      toast({
        title: "Error",
        description: "User with this email already exists",
        variant: "destructive",
      })
      return
    }

    if (users.find(u => u.username === newUsername)) {
      toast({
        title: "Error",
        description: "User with this username already exists",
        variant: "destructive",
      })
      return
    }

    const newUser: User = {
      id: uuidv4(),
      email: newEmail,
      username: newUsername,
      password: newPassword,
      role: newRole,
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem('jessUsers', JSON.stringify(updatedUsers))
    
    setNewEmail("")
    setNewUsername("")
    setNewPassword("")
    setNewRole('user')
    setShowNewPassword(false)
    
    toast({
      title: "Account created",
      description: `Account for ${newEmail} has been created successfully`,
    })
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.filter(u => u.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem('jessUsers', JSON.stringify(updatedUsers))
    
    toast({
      title: "User deleted",
      description: "User has been deleted successfully",
    })
  }

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    )
    setUsers(updatedUsers)
    localStorage.setItem('jessUsers', JSON.stringify(updatedUsers))
    
    toast({
      title: "Role updated",
      description: "User role has been updated successfully",
    })
  }

  const handleStartEdit = (userId: string, field: 'username' | 'password') => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setEditingUser(userId)
      setEditingField(field)
      setEditValue(user[field])
    }
  }

  const handleSaveEdit = () => {
    if (!editingUser || !editingField || !editValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid value",
        variant: "destructive",
      })
      return
    }

    // Check for duplicates
    if (editingField === 'username' && users.find(u => u.username === editValue && u.id !== editingUser)) {
      toast({
        title: "Error",
        description: "Username already exists",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map(user => 
      user.id === editingUser ? { ...user, [editingField]: editValue } : user
    )
    setUsers(updatedUsers)
    localStorage.setItem('jessUsers', JSON.stringify(updatedUsers))
    
    setEditingUser(null)
    setEditingField(null)
    setEditValue("")
    
    toast({
      title: "User updated",
      description: `${editingField} has been updated successfully`,
    })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setEditingField(null)
    setEditValue("")
  }

  const handleAddOrganization = () => {
    if (!newOrganization.trim()) {
      toast({
        title: "Error",
        description: "Please enter an organization name",
        variant: "destructive",
      })
      return
    }

    if (organizations.includes(newOrganization.trim())) {
      toast({
        title: "Error",
        description: "Organization already exists",
        variant: "destructive",
      })
      return
    }

    const updatedOrganizations = [...organizations, newOrganization.trim()]
    setOrganizations(updatedOrganizations)
    localStorage.setItem('jessOrganizations', JSON.stringify(updatedOrganizations))
    setNewOrganization("")
    
    toast({
      title: "Organization added",
      description: `${newOrganization} has been added to the list`,
    })
  }

  const handleDeleteOrganization = (org: string) => {
    const updatedOrganizations = organizations.filter(o => o !== org)
    setOrganizations(updatedOrganizations)
    localStorage.setItem('jessOrganizations', JSON.stringify(updatedOrganizations))
    
    toast({
      title: "Organization removed",
      description: `${org} has been removed from the list`,
    })
  }

  const handleAddRole = () => {
    if (!newCredentialRole.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      })
      return
    }

    if (roles.includes(newCredentialRole.trim())) {
      toast({
        title: "Error",
        description: "Role already exists",
        variant: "destructive",
      })
      return
    }

    const updatedRoles = [...roles, newCredentialRole.trim()]
    setRoles(updatedRoles)
    localStorage.setItem('jessRoles', JSON.stringify(updatedRoles))
    setNewCredentialRole("")
    
    toast({
      title: "Role added",
      description: `${newCredentialRole} has been added to the list`,
    })
  }

  const handleDeleteRole = (role: string) => {
    const updatedRoles = roles.filter(r => r !== role)
    setRoles(updatedRoles)
    localStorage.setItem('jessRoles', JSON.stringify(updatedRoles))
    
    toast({
      title: "Role removed",
      description: `${role} has been removed from the list`,
    })
  }

  const handleOrganizationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddOrganization()
    }
  }

  const handleRoleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRole()
    }
  }

  const togglePasswordVisibility = (userId: string) => {
    const newVisiblePasswords = new Set(visiblePasswords)
    if (newVisiblePasswords.has(userId)) {
      newVisiblePasswords.delete(userId)
    } else {
      newVisiblePasswords.add(userId)
    }
    setVisiblePasswords(newVisiblePasswords)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Create New Account</h3>
          <Input 
            placeholder="Email" 
            value={newEmail} 
            onChange={e => setNewEmail(e.target.value)} 
          />
          <Input 
            placeholder="Username" 
            value={newUsername} 
            onChange={e => setNewUsername(e.target.value)} 
          />
          <div className="relative">
            <Input 
              type={showNewPassword ? "text" : "password"} 
              placeholder="Password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Select value={newRole} onValueChange={(value: 'admin' | 'user') => setNewRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateUser}>Create Account</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Manage Issuing Organizations</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Organization name" 
              value={newOrganization} 
              onChange={e => setNewOrganization(e.target.value)}
              onKeyPress={handleOrganizationKeyPress}
            />
            <Button onClick={handleAddOrganization}>Add</Button>
          </div>
          <div className="space-y-2">
            {organizations.map(org => (
              <div key={org} className="flex justify-between items-center p-2 border rounded">
                <span>{org}</span>
                <Button 
                  onClick={() => handleDeleteOrganization(org)} 
                  variant="destructive" 
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Manage Credential Roles</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Role name (e.g., Peer Reviewer, Editor)" 
              value={newCredentialRole} 
              onChange={e => setNewCredentialRole(e.target.value)}
              onKeyPress={handleRoleKeyPress}
            />
            <Button onClick={handleAddRole}>Add</Button>
          </div>
          <div className="space-y-2">
            {roles.map(role => (
              <div key={role} className="flex justify-between items-center p-2 border rounded">
                <span>{role}</span>
                <Button 
                  onClick={() => handleDeleteRole(role)} 
                  variant="destructive" 
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">User Management</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editingUser === user.id && editingField === 'username' ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          value={editValue} 
                          onChange={e => setEditValue(e.target.value)}
                          className="w-32"
                        />
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{user.username}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(user.id, 'username')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === user.id && editingField === 'password' ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          type="text"
                          value={editValue} 
                          onChange={e => setEditValue(e.target.value)}
                          className="w-32"
                        />
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {visiblePasswords.has(user.id) ? user.password : '••••••••'}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {visiblePasswords.has(user.id) ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(user.id, 'password')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={user.role} 
                      onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-24">
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
                    {user.id !== currentUser.id && (
                      <Button 
                        onClick={() => handleDeleteUser(user.id)} 
                        variant="destructive" 
                        size="sm"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
