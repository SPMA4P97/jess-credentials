import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CredentialForm from '@/components/CredentialForm'
import CredentialsList from '@/components/CredentialsList'
import CredentialResultDialog from '@/components/CredentialResultDialog'
import PDFViewer from '@/components/PDFViewer'
import CredentialViewer from '@/components/CredentialViewer'
import Login from '@/components/Login'
import UserManagement from '@/components/UserManagement'

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
    setIsDialogOpen(false)
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
