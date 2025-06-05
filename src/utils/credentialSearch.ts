
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

export const searchCredential = (credentialId: string, lastName: string): Credential | null => {
  // Try to get credentials from localStorage first
  let credentials: Credential[] = []
  const saved = localStorage.getItem('jessCredentials')
  if (saved) {
    try {
      credentials = JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing localStorage credentials:', e)
    }
  }

  // Also try to get from sessionStorage as backup
  const sessionSaved = sessionStorage.getItem('jessCredentials')
  if (sessionSaved && credentials.length === 0) {
    try {
      credentials = JSON.parse(sessionSaved)
    } catch (e) {
      console.error('Error parsing sessionStorage credentials:', e)
    }
  }

  console.log('Available credentials:', credentials.length)
  
  if (credentials.length > 0) {
    const credential = credentials.find(c => 
      c.id === credentialId && 
      c.name.toLowerCase().includes(lastName.toLowerCase())
    )
    return credential || null
  }
  
  return null
}
