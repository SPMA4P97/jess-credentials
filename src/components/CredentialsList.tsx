
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface SupabaseCredential {
  id: string
  name: string
  role: string
  organization_name: string
  issue_date: string
  info: string
  expiry_date: string
  volumes?: string
  public_credential_url?: string
}

interface CredentialsListProps {
  credentials: SupabaseCredential[]
  onDelete: (id: string) => void
  onViewPDF: (credential: SupabaseCredential) => void
}

export default function CredentialsList({ credentials, onDelete }: CredentialsListProps) {
  const { toast } = useToast()

  if (credentials.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No credentials found in database.</p>
        </CardContent>
      </Card>
    )
  }

  const getPublicCredentialUrl = (credentialId: string) => {
    return `${window.location.origin}/credential/${credentialId}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "ID copied to clipboard.",
      })
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      })
    })
  }

  const handleViewPublic = (credentialId: string) => {
    const publicUrl = getPublicCredentialUrl(credentialId)
    window.open(publicUrl, '_blank')
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">All Credentials from Database</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Organization</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Volumes</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Public URL</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.organization_name || '—'}</TableCell>
                  <TableCell>{c.name || '—'}</TableCell>
                  <TableCell>{c.role || '—'}</TableCell>
                  <TableCell>{c.issue_date || '—'}</TableCell>
                  <TableCell>{c.expiry_date || '—'}</TableCell>
                  <TableCell>
                    {c.volumes ? c.volumes.split(', ').filter(Boolean).join(', ') : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={c.info || ''}>
                      {c.info || '—'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleViewPublic(c.id)}
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink size={12} />
                      View Public
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{c.id}</span>
                      <Button 
                        onClick={() => copyToClipboard(c.id)} 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => onDelete(c.id)} variant="destructive" size="sm">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
