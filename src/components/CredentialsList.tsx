
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Credential {
  id: string
  name: string
  role: string
  organization: string
  date: string
  issue: string
  expiry: string
}

interface CredentialsListProps {
  credentials: Credential[]
  onDelete: (id: string) => void
}

export default function CredentialsList({ credentials, onDelete }: CredentialsListProps) {
  if (credentials.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No credentials generated yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">All Credentials</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Organization</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Expiry</TableCell>
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
                <TableCell>{c.id}</TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(c.id)} variant="destructive">Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
