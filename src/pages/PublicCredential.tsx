
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4 print:hidden">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-blue-800">Digital Credential</h1>
        </div>
        
        {/* Certificate optimized for landscape printing (11" x 8.5") */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg print:shadow-none print:border-black print:rounded-none" style={{ width: '100%', maxWidth: '1056px', height: '816px', margin: '0 auto' }}>
          <div className="h-full p-12 flex flex-col justify-between text-black print:p-8">
            <div className="text-center space-y-4">
              {/* Header */}
              <div className="border-b-2 border-blue-600 pb-4 print:border-black">
                <h2 className="text-4xl font-bold text-blue-800 mb-2 print:text-black">
                  {credential.organization_name}
                </h2>
                <h3 className="text-2xl font-semibold text-gray-700 print:text-black">
                  Digital Credential Certificate
                </h3>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <div className="text-lg print:text-xl">
                  <p className="mb-3">This is to certify that</p>
                  <p className="text-5xl font-bold text-blue-800 border-b border-gray-300 pb-3 mb-4 print:text-black print:border-black">
                    {credential.name}
                  </p>
                  <p className="mb-3">has successfully served as</p>
                  <p className="text-3xl font-semibold text-gray-800 mb-4 print:text-black">
                    {credential.role}
                  </p>
                  
                  {credential.info && (
                    <p className="text-gray-700 mb-4 text-base print:text-black leading-relaxed">
                      {credential.info}
                    </p>
                  )}

                  {volumes.length > 0 && (
                    <p className="text-gray-700 mb-4 text-base print:text-black">
                      Contributing to: {volumes.join(', ')}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className={`grid ${formattedExpiryDate ? 'grid-cols-2' : 'grid-cols-1 place-items-center'} gap-6 max-w-2xl mx-auto`}>
                  <div className="border rounded-lg p-3 print:border-black">
                    <p className="font-semibold text-gray-600 text-sm print:text-black">Issue Date</p>
                    <p className="text-lg print:text-xl">{formattedIssueDate}</p>
                  </div>
                  
                  {formattedExpiryDate && (
                    <div className="border rounded-lg p-3 print:border-black">
                      <p className="font-semibold text-gray-600 text-sm print:text-black">Expiration Date</p>
                      <p className="text-lg print:text-xl">{formattedExpiryDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-3">
              {/* Credential ID */}
              <div className="border-t pt-3 text-center print:border-black">
                <p className="text-sm text-gray-600 print:text-black">Credential ID</p>
                <p className="font-mono text-base font-semibold print:text-lg">{credential.id}</p>
              </div>

              {/* Public URL for easy copying */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1 print:text-black print:text-sm">Verify this credential at:</p>
                <p className="font-mono text-xs text-blue-600 break-all border rounded p-2 bg-gray-50 print:text-black print:border-black print:bg-white print:text-sm max-w-4xl mx-auto">
                  {publicUrl}
                </p>
              </div>

              {/* Organization footer */}
              <div className="border-t-2 border-blue-600 pt-2 text-center print:border-black">
                <p className="text-xs text-gray-500 print:text-black print:text-sm">This digital credential is issued by {credential.organization_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
