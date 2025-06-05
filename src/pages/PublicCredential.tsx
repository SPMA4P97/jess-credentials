
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { fetchCredentialByIdFromSupabase } from '../utils/supabaseAPI'

interface SupabaseCredential {
  id: string
  name: string
  role: string
  organization_name: string
  issue_date: string
  info: string
  expiry_date: string
  volumes: string
  public_credential_url: string
}

export default function PublicCredential() {
  const { id } = useParams<{ id: string }>()
  const [credential, setCredential] = useState<SupabaseCredential | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCredential = async () => {
      if (!id) {
        setError('No credential ID provided')
        setLoading(false)
        return
      }

      try {
        const data = await fetchCredentialByIdFromSupabase(id)
        if (data) {
          setCredential(data)
        } else {
          setError('Credential not found')
        }
      } catch (err) {
        setError('Failed to load credential')
        console.error('Error fetching credential:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCredential()
  }, [id])

  const handleViewPDF = () => {
    if (credential?.public_credential_url) {
      window.open(credential.public_credential_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardContent className="p-8 text-center">
            <p>Loading credential...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !credential) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Credential Not Found</h1>
            <p className="text-gray-600">{error}</p>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedIssueDate = credential.issue_date ? format(new Date(credential.issue_date), 'MMMM dd, yyyy') : ''
  const formattedExpiryDate = credential.expiry_date ? format(new Date(credential.expiry_date), 'MMMM dd, yyyy') : ''
  const volumes = credential.volumes ? credential.volumes.split(', ').filter(Boolean) : []
  const publicUrl = `${window.location.origin}/credential/${credential.id}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-blue-800">Digital Credential</h1>
            </div>
            
            {/* Certificate in landscape orientation */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg" style={{ aspectRatio: '11/8.5', minHeight: '600px' }}>
              <div className="h-full p-12 flex flex-col justify-between">
                <div className="text-center space-y-8">
                  {/* Header */}
                  <div className="border-b-2 border-blue-600 pb-6">
                    <h2 className="text-4xl font-bold text-blue-800 mb-3">
                      {credential.organization_name}
                    </h2>
                    <h3 className="text-2xl font-semibold text-gray-700">
                      Digital Credential Certificate
                    </h3>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-8">
                    <div className="text-xl">
                      <p className="mb-6">This is to certify that</p>
                      <p className="text-5xl font-bold text-blue-800 border-b border-gray-300 pb-4 mb-8">
                        {credential.name}
                      </p>
                      <p className="mb-6">has successfully served as</p>
                      <p className="text-3xl font-semibold text-gray-800 mb-8">
                        {credential.role}
                      </p>
                      
                      {credential.info && (
                        <p className="text-gray-700 mb-6 text-lg">
                          {credential.info}
                        </p>
                      )}

                      {volumes.length > 0 && (
                        <p className="text-gray-700 mb-6 text-lg">
                          Contributing to: {volumes.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className={`grid ${formattedExpiryDate ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 place-items-center'} gap-6`}>
                      <div className="border rounded-lg p-4">
                        <p className="font-semibold text-gray-600 text-sm">Issue Date</p>
                        <p className="text-lg">{formattedIssueDate}</p>
                      </div>
                      
                      {formattedExpiryDate && (
                        <div className="border rounded-lg p-4">
                          <p className="font-semibold text-gray-600 text-sm">Expiration Date</p>
                          <p className="text-lg">{formattedExpiryDate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-4">
                  {/* Credential ID */}
                  <div className="border-t pt-4 text-center">
                    <p className="text-sm text-gray-600">Credential ID</p>
                    <p className="font-mono text-lg font-semibold">{credential.id}</p>
                  </div>

                  {/* Public URL for easy copying */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">Verify this credential at:</p>
                    <p className="font-mono text-sm text-blue-600 break-all border rounded p-2 bg-gray-50">
                      {publicUrl}
                    </p>
                  </div>

                  {/* Actions */}
                  {credential.public_credential_url && (
                    <div className="flex justify-center gap-4 pt-4">
                      <Button onClick={handleViewPDF} className="flex items-center gap-2">
                        <FileText size={16} />
                        View PDF
                      </Button>
                      <a 
                        href={credential.public_credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="flex items-center gap-2">
                          <ExternalLink size={16} />
                          External Link
                        </Button>
                      </a>
                    </div>
                  )}

                  {/* Organization footer */}
                  <div className="border-t-2 border-blue-600 pt-3 text-center">
                    <p className="text-xs text-gray-500">This digital credential is issued by {credential.organization_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
