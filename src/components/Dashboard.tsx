import { useState } from 'react'
import Login from './Login'
import UserManagement from './UserManagement'

interface User {
  id: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('jessCredentialsAuth') === 'true'
  })

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Initialize users from localStorage or with default users including permanent accounts
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('jessUsers')
    if (savedUsers) {
      const existingUsers = JSON.parse(savedUsers)
      // Check if permanent accounts already exist
      const hasNlacoste = existingUsers.some((u: User) => u.username === 'nlacoste')
      const hasTmckee = existingUsers.some((u: User) => u.username === 'tmckee')
      
      // Add missing permanent accounts
      const updatedUsers = [...existingUsers]
      if (!hasNlacoste) {
        updatedUsers.push({
          id: 'nlacoste-permanent',
          email: 'nlacoste@jessjournal.com',
          username: 'nlacoste',
          password: 'JESS2025',
          role: 'user' as const,
          createdAt: '2024-01-01 10:00'
        })
      }
      if (!hasTmckee) {
        updatedUsers.push({
          id: 'tmckee-permanent',
          email: 'tmckee@jessjournal.com', 
          username: 'tmckee',
          password: 'JESS2025',
          role: 'user' as const,
          createdAt: '2024-01-01 10:00'
        })
      }
      
      // Save updated users back to localStorage
      localStorage.setItem('jessUsers', JSON.stringify(updatedUsers))
      return updatedUsers
    }
    
    // Default users including admin and permanent accounts
    const defaultUsers: User[] = [
      {
        id: 'default-admin',
        email: 'admin@jessjournal.com',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        createdAt: '2024-01-01 10:00'
      },
      {
        id: 'nlacoste-permanent',
        email: 'nlacoste@jessjournal.com',
        username: 'nlacoste',
        password: 'JESS2025',
        role: 'user',
        createdAt: '2024-01-01 10:00'
      },
      {
        id: 'tmckee-permanent',
        email: 'tmckee@jessjournal.com',
        username: 'tmckee',
        password: 'JESS2025',
        role: 'user',
        createdAt: '2024-01-01 10:00'
      }
    ]
    localStorage.setItem('jessUsers', JSON.stringify(defaultUsers))
    return defaultUsers
  })

  // Initialize organizations from localStorage
  const [organizations, setOrganizations] = useState<string[]>(() => {
    const savedOrgs = localStorage.getItem('jessOrganizations')
    if (savedOrgs) {
      return JSON.parse(savedOrgs)
    }
    const defaultOrgs = ['Journal of Emerging Sport Studies', 'University Research Center']
    localStorage.setItem('jessOrganizations', JSON.stringify(defaultOrgs))
    return defaultOrgs
  })

  // Initialize roles from localStorage
  const [roles, setRoles] = useState<string[]>(() => {
    const savedRoles = localStorage.getItem('jessRoles')
    if (savedRoles) {
      return JSON.parse(savedRoles)
    }
    const defaultRoles = ['Peer Reviewer', 'Editor', 'Associate Editor', 'Editorial Board Member']
    localStorage.setItem('jessRoles', JSON.stringify(defaultRoles))
    return defaultRoles
  })

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    localStorage.setItem('jessCredentialsAuth', 'true')
  }

  if (!isLoggedIn || !currentUser) {
    return <Login onLogin={handleLogin} users={users} />
  }

  return (
    <UserManagement 
      users={users}
      setUsers={setUsers}
      currentUser={currentUser}
      organizations={organizations}
      setOrganizations={setOrganizations}
      roles={roles}
      setRoles={setRoles}
    />
  )
}
