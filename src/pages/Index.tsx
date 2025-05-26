

// Lovable-compatible React app with credential generation, public viewer, login gating, and credential table

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from 'lucide-react'

interface User {
  id: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
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

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">JESS Admin Login</h2>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
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
          <Input 
            type="password" 
            placeholder="Password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
          />
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
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [issue, setIssue] = useState("")
  const [expiry, setExpiry] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [credentialId, setCredentialId] = useState("")
  const [credentials, setCredentials] = useState([])
  const [searchParams] = useSearchParams()
  const credentialFromURL = searchParams.get('credentialId')

  const handleGenerate = () => {
    const newId = uuidv4().split('-')[0]
    const newCredential = {
      id: newId,
      name,
      role,
      organization: selectedOrganization,
      date,
      issue,
      expiry
    }
    setCredentials([...credentials, newCredential])
    setCredentialId(newId)
    setSubmitted(true)
  }

  const handleDelete = (idToDelete) => {
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

      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credentials">Credential Generator</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Credential Generator</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Issuing Organization</label>
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
                
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Date</label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Expiration Date</label>
                  <Input type="date" placeholder="Expiry Date (optional)" value={expiry} onChange={e => setExpiry(e.target.value)} />
                </div>
                
                <Textarea placeholder="Journal Issue or Description" value={issue} onChange={e => setIssue(e.target.value)} />
              </div>

              <Button onClick={handleGenerate}>Generate Credential</Button>
            </CardContent>
          </Card>

          {submitted && (
            <Card>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">Credential Generated</h3>
                <p><strong>Organization:</strong> {selectedOrganization}</p>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Role:</strong> {role}</p>
                <p><strong>Issue Date:</strong> {date}</p>
                <p><strong>Expiration Date:</strong> {expiry || 'None'}</p>
                <p><strong>Journal Info:</strong> {issue}</p>
                <p><strong>Credential ID:</strong> {credentialId}</p>
                <p><strong>Credential URL:</strong> https://yourjournal.org/credentials/{credentialId}</p>
              </CardContent>
            </Card>
          )}

          {credentials.length > 0 && (
            <Card>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">All Credentials</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Organization</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Issue Date</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {credentials.map(c => (
                      <TableRow key={c.id}>
                        <TableCell>{c.organization || '—'}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.role}</TableCell>
                        <TableCell>{c.date}</TableCell>
                        <TableCell>{c.expiry || '—'}</TableCell>
                        <TableCell>{c.id}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleDelete(c.id)} variant="destructive">Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
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
    </div>
  )
}

