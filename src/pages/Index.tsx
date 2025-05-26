// Lovable-compatible React app with credential generation, public viewer, login gating, and credential table

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from 'lucide-react'
import CredentialForm from '@/components/CredentialForm'
import CredentialsList from '@/components/CredentialsList'
import CredentialResultDialog from '@/components/CredentialResultDialog'

interface User {
  id: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

interface Credential {
  id: string
  name: string
  role: string
  organization: string
  date: string
  issue: string
  expiry: string
}

function CredentialViewer({ id }) {
  if (!id) return <p className="text-center">Invalid credential ID.</p>

  return (
    <Card className="mt-6">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Credential Viewer</h3>
        <p>This is a placeholder for Credential ID: <strong>{id}</strong></p>
        <p>In production, this page would fetch credential data from a backend or database.</p>
      </CardContent>
    </Card>
  )
}

function Login({ onLogin, users }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      onLogin(user)
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.email}!`,
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">JESS Admin Login</h2>
        <Input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <Button onClick={handleLogin}>Login</Button>
      </CardContent>
    </Card>
  )
}

function UserManagement({ users, setUsers, currentUser, organizations, setOrganizations }) {
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user')
  const [newOrganization, setNewOrganization] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { toast } = useToast()

  const handleCreateUser = () => {
    if (!newEmail || !newPassword) {
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

    const newUser: User = {
      id: uuidv4(),
      email: newEmail,
      password: newPassword,
      role: newRole,
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
    }

    setUsers([...users, newUser])
    setNewEmail("")
    setNewPassword("")
    setNewRole('user')
    setShowNewPassword(false)
    
    toast({
      title: "User created",
      description: `User ${newEmail} has been created successfully`,
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

    setUsers(users.filter(u => u.id !== userId))
    toast({
      title: "User deleted",
      description: "User has been deleted successfully",
    })
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

    setOrganizations([...organizations, newOrganization.trim()])
    setNewOrganization("")
    toast({
      title: "Organization added",
      description: `${newOrganization} has been added to the list`,
    })
  }

  const handleDeleteOrganization = (org: string) => {
    setOrganizations(organizations.filter(o => o !== org))
    toast({
      title: "Organization removed",
      description: `${org} has been removed from the list`,
    })
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
          <h3 className="text-lg font-semibold">Create New User</h3>
          <Input 
            placeholder="Email" 
            value={newEmail} 
            onChange={e => setNewEmail(e.target.value)} 
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
          <select 
            className="w-full p-2 border rounded-md" 
            value={newRole} 
            onChange={e => setNewRole(e.target.value as 'admin' | 'user')}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={handleCreateUser}>Create User</Button>
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
          <h3 className="text-lg font-semibold">User Management</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Email</TableCell>
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
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

export default function CredentialApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([
    {
      id: uuidv4(),
      email: "admin@yourjournal.org",
      password: "password123",
      role: 'admin',
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
    }
  ])
  const [organizations, setOrganizations] = useState<string[]>([
    "Journal of Environmental Science",
    "International Review of Economics",
    "Medical Research Quarterly",
    "Tech Innovation Today"
  ])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const credentialFromURL = searchParams.get('credentialId')

  const handleCredentialGenerated = (credential: Credential) => {
    setCredentials([...credentials, credential])
    setSelectedCredential(credential)
    setIsDialogOpen(true)
  }

  const handleDeleteCredential = (idToDelete: string) => {
    setCredentials(credentials.filter(c => c.id !== idToDelete))
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (credentialFromURL) {
    return <CredentialViewer id={credentialFromURL} />
  }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} users={users} />
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">JESS Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {currentUser.email} ({currentUser.role})
          </span>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Credential Generator</TabsTrigger>
          <TabsTrigger value="credentials">All Credentials</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <CredentialForm 
            organizations={organizations}
            onCredentialGenerated={handleCredentialGenerated}
          />
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <CredentialsList 
            credentials={credentials}
            onDelete={handleDeleteCredential}
          />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement 
            users={users} 
            setUsers={setUsers} 
            currentUser={currentUser} 
            organizations={organizations}
            setOrganizations={setOrganizations}
          />
        </TabsContent>
      </Tabs>

      <CredentialResultDialog
        credential={selectedCredential}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
