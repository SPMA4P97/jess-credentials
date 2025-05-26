import { useSearchParams } from 'react-router-dom'
import CredentialViewer from '@/components/CredentialViewer'
import Dashboard from '@/components/Dashboard'

export default function CredentialApp() {
  const [searchParams] = useSearchParams()
  const credentialFromURL = searchParams.get('credentialId')

  // If there's a credential ID in the URL, show the public credential viewer
  if (credentialFromURL) {
    return <CredentialViewer id={credentialFromURL} />
  }

  // Otherwise, show the main dashboard (which handles authentication)
  return <Dashboard />
}
