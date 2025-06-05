
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from 'lucide-react'

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

interface CredentialsListProps {
  credentials: Credential[]
  onDelete: (id: string) => void
  onViewPDF: (credential: Credential) => void
}

export default function CredentialsList({ credentials, onDelete, onViewPDF }: CredentialsListProps) {
  if (credentials.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No credentials generated yet.</p>
        </CardContent>
      </Card>
    )
  }

  const getPublicCredentialUrl = (credentialId: string) => {
    return `${window.location.origin}/credential/${credentialId}`
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">All Credentials</h3>
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
                  <TableCell>{c.organization || '—'}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.role}</TableCell>
                  <TableCell>{c.date}</TableCell>
                  <TableCell>{c.expiry || '—'}</TableCell>
                  <TableCell>
                    {c.hideVolumes ? '—' : (c.volumes?.length ? c.volumes.join(', ') : '—')}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={c.issue}>
                      {c.issue || '—'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={getPublicCredentialUrl(c.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink size={12} />
                      View Public
                    </a>
                  </TableCell>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => onViewPDF(c)} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <FileText size={14} />
                        PDF
                      </Button>
                      <Button onClick={() => onDelete(c.id)} variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
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
