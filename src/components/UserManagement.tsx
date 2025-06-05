
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import NavigationTabs from './NavigationTabs'
import CredentialsTab from './CredentialsTab'
import AllCredentialsTab from './AllCredentialsTab'
import UsersTab from './UsersTab'
import SettingsTab from './SettingsTab'
import PDFViewer from './PDFViewer'
import CredentialResultDialog from './CredentialResultDialog'

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
  const [activeTab, setActiveTab] = useState<'credentials' | 'all-credentials' | 'users' | 'settings'>('credentials')
  const [credentials, setCredentials] = useState<Credential[]>(() => {
    const saved = localStorage.getItem('jessCredentials')
    return saved ? JSON.parse(saved) : []
  })
  const [pdfCredential, setPdfCredential] = useState<Credential | null>(null)
  const [newCredential, setNewCredential] = useState<Credential | null>(null)

  const handleLogout = () => {
    localStorage.removeItem('jessCredentialsAuth')
    window.location.reload()
  }

  const handleCredentialGenerated = (credential: Credential) => {
    const updatedCredentials = [...credentials, credential]
    setCredentials(updatedCredentials)
    localStorage.setItem('jessCredentials', JSON.stringify(updatedCredentials))
    setNewCredential(credential)
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
        <NavigationTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={currentUser.role === 'admin'}
        />

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'credentials' && (
            <CredentialsTab
              organizations={organizations}
              roles={roles}
              onCredentialGenerated={handleCredentialGenerated}
            />
          )}

          {activeTab === 'all-credentials' && (
            <AllCredentialsTab
              credentials={credentials}
              onDeleteCredential={handleDeleteCredential}
              onViewPDF={handleViewPDF}
            />
          )}

          {activeTab === 'users' && currentUser.role === 'admin' && (
            <UsersTab
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'settings' && currentUser.role === 'admin' && (
            <SettingsTab
              organizations={organizations}
              setOrganizations={setOrganizations}
              roles={roles}
              setRoles={setRoles}
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>

      <PDFViewer 
        credential={pdfCredential}
        isOpen={!!pdfCredential}
        onClose={() => setPdfCredential(null)}
      />

      <CredentialResultDialog
        credential={newCredential}
        isOpen={!!newCredential}
        onClose={() => setNewCredential(null)}
        onViewPDF={handleViewPDF}
      />
    </div>
  )
}
