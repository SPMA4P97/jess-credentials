import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Edit2, Check, X, Download } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CredentialForm from '@/components/CredentialForm'
import CredentialsList from '@/components/CredentialsList'
import CredentialResultDialog from '@/components/CredentialResultDialog'
import PDFViewer from '@/components/PDFViewer'

interface User {
  id: string
  email: string
  username: string
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
  volumes?: string[]
  hideVolumes?: boolean
}

function CredentialViewer({ id }) {
  const [credentials] = useState<Credential[]>(() => {
    const savedCredentials = localStorage.getItem('jessCredentials')
    return savedCredentials ? JSON.parse(savedCredentials) : []
  })

  const credential = credentials.find(c => c.id === id)

  const handleDownloadPDF = () => {
    // Create a new window with the credential content for printing/saving as PDF
    const printWindow = window.open('', '_blank')
    if (printWindow && credential) {
      const formattedDate = format(new Date(credential.date), 'MMMM dd, yyyy')
      const formattedExpiry = credential.expiry ? format(new Date(credential.expiry), 'MMMM dd, yyyy') : null

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Digital Credential - ${credential.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: white; }
            .certificate { max-width: 800px; margin: 0 auto; padding: 60px; border: 3px solid #2563eb; background: white; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 30px; margin-bottom: 40px; }
            .org-name { font-size: 36px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .cert-title { font-size: 24px; font-weight: 600; color: #374151; }
            .content { text-align: center; font-size: 18px; line-height: 1.6; }
            .recipient-name { font-size: 32px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #d1d5db; padding-bottom: 10px; margin: 20px 0; }
            .role { font-size: 24px; font-weight: 600; color: #374151; margin: 20px 0; }
            .dates { display: flex; justify-content: space-around; margin: 40px 0; font-size: 14px; }
            .date-box { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; }
            .credential-id { border-top: 3px solid #2563eb; padding-top: 30px; margin-top: 40px; }
            .footer { border-top: 3px solid #2563eb; padding-top: 30px; margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="org-name">${credential.organization}</div>
              <div class="cert-title">Digital Credential Certificate</div>
            </div>
            <div class="content">
              <p>This is to certify that</p>
              <div class="recipient-name">${credential.name}</div>
              <p>has successfully served as</p>
              <div class="role">${credential.role}</div>
              ${credential.issue ? `<p style="color: #374151; margin: 20px 0;">${credential.issue}</p>` : ''}
              ${!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 ? 
                `<p style="color: #374151; margin: 20px 0;">Contributing to: ${credential.volumes.join(', ')}</p>` : ''}
              <div class="dates">
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Issue Date</div>
                  <div style="font-size: 18px;">${formattedDate}</div>
                </div>
                ${formattedExpiry ? `
                <div class="date-box">
                  <div style="font-weight: 600; color: #374151;">Expiration Date</div>
                  <div style="font-size: 18px;">${formattedExpiry}</div>
                </div>` : ''}
              </div>
              <div class="credential-id">
                <div style="font-weight: 600; color: #374151; font-size: 14px;">Credential ID</div>
                <div style="font-family: monospace; font-size: 18px; font-weight: 600;">${credential.id}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">
                  Verify at: ${window.location.origin}/?credentialId=${credential.id}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This digital credential is issued by ${credential.organization}</p>
              <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Credential Not Found</h2>
            <p className="text-gray-600">The credential with ID <strong>{id}</strong> could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedDate = format(new Date(credential.date), 'MMMM dd, yyyy')
  const formattedExpiry = credential.expiry ? format(new Date(credential.expiry), 'MMMM dd, yyyy') : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-end">
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download size={16} />
            Download PDF
          </Button>
        </div>
        
        <Card className="bg-white border-2 border-gray-300 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Header */}
              <div className="border-b-2 border-blue-600 pb-4">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">
                  {credential.organization}
                </h1>
                <h2 className="text-xl font-semibold text-gray-700">
                  Digital Credential Certificate
                </h2>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <div className="text-lg">
                  <p className="mb-4">This is to certify that</p>
                  <p className="text-2xl font-bold text-blue-800 border-b border-gray-300 pb-2 mb-4">
                    {credential.name}
                  </p>
                  <p className="mb-4">has successfully served as</p>
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    {credential.role}
                  </p>
                  
                  {credential.issue && (
                    <p className="text-gray-700 mb-4">
                      {credential.issue}
                    </p>
                  )}

                  {!credential.hideVolumes && credential.volumes && credential.volumes.length > 0 && (
                    <p className="text-gray-700 mb-4">
                      Contributing to: {credential.volumes.join(', ')}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="border rounded p-3">
                    <p className="font-semibold text-gray-600">Issue Date</p>
                    <p className="text-lg">{formattedDate}</p>
                  </div>
                  
                  {formattedExpiry && (
                    <div className="border rounded p-3">
                      <p className="font-semibold text-gray-600">Expiration Date</p>
                      <p className="text-lg">{formattedExpiry}</p>
                    </div>
                  )}
                </div>

                {/* Credential ID */}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Credential ID</p>
                  <p className="font-mono text-lg font-semibold">{credential.id}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Verify at: {window.location.origin}/?credentialId={credential.id}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-blue-600 pt-4 text-xs text-gray-500">
                <p>This digital credential is issued by {credential.organization}</p>
                <p>Generated on {format(new Date(), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Login({ onLogin, users }) {
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleLogin = () => {
    const user = users.find(u => 
      (u.email === emailOrUsername || u.username === emailOrUsername) && 
      u.password === password
    )
    if (user) {
      onLogin(user)
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.email}!`,
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email/username or password",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto shadow-xl">
        <CardContent className="space-y-6 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-800">JESS Credentials Portal</h1>
            <p className="text-gray-600">Journal of Emerging Sport Studies</p>
          </div>
          
          <div className="space-y-4">
            <Input 
              placeholder="Email or Username" 
              value={emailOrUsername} 
              onChange={e => setEmailOrUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center"
            />
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center"
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
            <Button onClick={handleLogin} className="w-full">Access Portal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UserManagement({ users, setUsers, currentUser, organizations, setOrganizations, roles, setRoles }) {
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

export default function CredentialApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Load users from localStorage or use default with permanent admins
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('jessUsers')
    if (savedUsers) {
      const existingUsers = JSON.parse(savedUsers)
      
      // Add permanent admin accounts if they don't exist
      const permanentAdmins = [
        {
          id: 'nlacoste-admin',
          email: "nlacoste@jess.org",
          username: "nlacoste",
          password: "JESS2025",
          role: 'admin' as const,
          createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
        },
        {
          id: 'tmckee-admin',
          email: "tmckee@jess.org",
          username: "tmckee",
          password: "JESS2025",
          role: 'admin' as const,
          createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
        }
      ]
      
      const updatedUsers = [...existingUsers]
      
      permanentAdmins.forEach(admin => {
        if (!updatedUsers.find(u => u.username === admin.username)) {
          updatedUsers.push(admin)
        }
      })
      
      localStorage.setItem('jessUsers', JSON.stringify(updatedUsers))
      return updatedUsers
    }
    
    const defaultUsers = [
      {
        id: uuidv4(),
        email: "admin@yourjournal.org",
        username: "admin",
        password: "password123",
        role: 'admin' as const,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
      },
      {
        id: 'nlacoste-admin',
        email: "nlacoste@jess.org",
        username: "nlacoste",
        password: "JESS2025",
        role: 'admin' as const,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
      },
      {
        id: 'tmckee-admin',
        email: "tmckee@jess.org",
        username: "tmckee",
        password: "JESS2025",
        role: 'admin' as const,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm')
      }
    ]
    localStorage.setItem('jessUsers', JSON.stringify(defaultUsers))
    return defaultUsers
  })

  // Load organizations from localStorage or use default
  const [organizations, setOrganizations] = useState<string[]>(() => {
    const savedOrganizations = localStorage.getItem('jessOrganizations')
    if (savedOrganizations) {
      return JSON.parse(savedOrganizations)
    }
    const defaultOrganizations = [
      "Journal of Environmental Science",
      "International Review of Economics", 
      "Medical Research Quarterly",
      "Tech Innovation Today"
    ]
    localStorage.setItem('jessOrganizations', JSON.stringify(defaultOrganizations))
    return defaultOrganizations
  })

  // Load roles from localStorage or use default
  const [roles, setRoles] = useState<string[]>(() => {
    const savedRoles = localStorage.getItem('jessRoles')
    if (savedRoles) {
      return JSON.parse(savedRoles)
    }
    const defaultRoles = [
      "Peer Reviewer",
      "Editorial Board Member",
      "Associate Editor",
      "Guest Editor",
      "Research Contributor",
      "Manuscript Reviewer"
    ]
    localStorage.setItem('jessRoles', JSON.stringify(defaultRoles))
    return defaultRoles
  })

  // Load credentials from localStorage
  const [credentials, setCredentials] = useState<Credential[]>(() => {
    const savedCredentials = localStorage.getItem('jessCredentials')
    return savedCredentials ? JSON.parse(savedCredentials) : []
  })

  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  const [pdfCredential, setPdfCredential] = useState<Credential | null>(null)
  const [searchParams] = useSearchParams()
  const credentialFromURL = searchParams.get('credentialId')

  const handleCredentialGenerated = (credential: Credential) => {
    const updatedCredentials = [...credentials, credential]
    setCredentials(updatedCredentials)
    localStorage.setItem('jessCredentials', JSON.stringify(updatedCredentials))
    setSelectedCredential(credential)
    setIsDialogOpen(true)
  }

  const handleDeleteCredential = (idToDelete: string) => {
    const updatedCredentials = credentials.filter(c => c.id !== idToDelete)
    setCredentials(updatedCredentials)
    localStorage.setItem('jessCredentials', JSON.stringify(updatedCredentials))
  }

  const handleViewPDF = (credential: Credential) => {
    setPdfCredential(credential)
    setIsPDFViewerOpen(true)
    setIsDialogOpen(false) // Close result dialog if open
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
            roles={roles}
            onCredentialGenerated={handleCredentialGenerated}
          />
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <CredentialsList 
            credentials={credentials}
            onDelete={handleDeleteCredential}
            onViewPDF={handleViewPDF}
          />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement 
            users={users} 
            setUsers={setUsers} 
            currentUser={currentUser} 
            organizations={organizations}
            setOrganizations={setOrganizations}
            roles={roles}
            setRoles={setRoles}
          />
        </TabsContent>
      </Tabs>

      <CredentialResultDialog
        credential={selectedCredential}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onViewPDF={handleViewPDF}
      />

      <PDFViewer
        credential={pdfCredential}
        isOpen={isPDFViewerOpen}
        onClose={() => setIsPDFViewerOpen(false)}
      />
    </div>
  )
}
