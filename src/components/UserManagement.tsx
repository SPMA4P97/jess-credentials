
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Users, FileText, Settings } from 'lucide-react'
import CredentialForm from './CredentialForm'
import CredentialsList from './CredentialsList'
import PDFViewer from './PDFViewer'

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

interface UserManagementProps {
  users: User[]
  setUsers: (users: User[]) => void
  currentUser: User
  organizations: string[]
  setOrganizations: (orgs: string[]) => void
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
  const [activeTab, setActiveTab] = useState<'credentials' | 'users' | 'settings'>('credentials')
  const [credentials, setCredentials] = useState<Credential[]>(() => {
    const saved = localStorage.getItem('jessCredentials')
    return saved ? JSON.parse(saved) : []
  })
  const [pdfCredential, setPdfCredential] = useState<Credential | null>(null)

  const handleLogout = () => {
    localStorage.removeItem('jessCredentialsAuth')
    window.location.reload()
  }

  const handleCredentialGenerated = (credential: Credential) => {
    const updatedCredentials = [...credentials, credential]
    setCredentials(updatedCredentials)
    localStorage.setItem('jessCredentials', JSON.stringify(updatedCredentials))
  }

  const handleDeleteCredential = (id: string) => {
    const updatedCredentials = credentials.filter(c => c.id !== id)
    setCredentials(updatedCredentials)
    localStorage.setItem('jessCredentials', JSON.stringify(updatedCredentials))
  }

  const handleViewPDF = (credential: Credential) => {
    setPdfCredential(credential)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">JESS Credentials Portal</h1>
              <p className="text-gray-600">Welcome, {currentUser.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'credentials' ? 'default' : 'outline'}
              onClick={() => setActiveTab('credentials')}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Credentials
            </Button>
            {currentUser.role === 'admin' && (
              <>
                <Button
                  variant={activeTab === 'users' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('users')}
                  className="flex items-center gap-2"
                >
                  <Users size={16} />
                  Users
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2"
                >
                  <Settings size={16} />
                  Settings
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Manage Credentials</h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <CredentialForm 
                  organizations={organizations}
                  roles={roles}
                  onCredentialGenerated={handleCredentialGenerated}
                />
                
                <div>
                  <CredentialsList 
                    credentials={credentials}
                    onDelete={handleDeleteCredential}
                    onViewPDF={handleViewPDF}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && currentUser.role === 'admin' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <div className="space-y-4">
                {users.map(user => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{user.email}</p>
                          <p className="text-sm text-gray-600">Role: {user.role}</p>
                          <p className="text-sm text-gray-600">Created: {user.createdAt}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && currentUser.role === 'admin' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">System Settings</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organizations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {organizations.map((org, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          {org}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Roles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {roles.map((role, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          {role}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {pdfCredential && (
        <PDFViewer 
          credential={pdfCredential}
          onClose={() => setPdfCredential(null)}
        />
      )}
    </div>
  )
}
