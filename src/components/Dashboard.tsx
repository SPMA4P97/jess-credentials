
import { useState } from 'react'
import Login from './Login'
import UserManagement from './UserManagement'

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('jessCredentialsAuth') === 'true'
  })

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  return <UserManagement />
}
