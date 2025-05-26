
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

  // Initialize users from localStorage or with default admin user
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('jessUsers')
    if (savedUsers) {
      return JSON.parse(savedUsers)
    }
    // Default admin user
    const defaultAdmin: User = {
      id: 'default-admin',
      email: 'admin@jessjournal.com',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      createdAt: '2024-01-01 10:00'
    }
    localStorage.setItem('jessUsers', JSON.stringify([defaultAdmin]))
    return [defaultAdmin]
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
