
// Lovable-compatible React app with credential generation, public viewer, login gating, and credential table

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

function CredentialViewer({ id }) {
  if (!id) return <p className="text-center">Invalid credential ID.</p>

  return (
    <Card className="mt-6">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Credential Viewer</h3>
        <p>This is a placeholder for Credential ID: <strong>{id}</strong></p>
        <p>In production, this page would fetch credential data from a backend or database.</p>
      </CardContent>
    </Card>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (email === "admin@yourjournal.org" && password === "password123") {
      onLogin()
    } else {
      alert("Invalid login")
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">JESS Admin Login</h2>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={handleLogin}>Login</Button>
      </CardContent>
    </Card>
  )
}

export default function CredentialApp() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [issue, setIssue] = useState("")
  const [expiry, setExpiry] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [credentialId, setCredentialId] = useState("")
  const [credentials, setCredentials] = useState([])
  const [searchParams] = useSearchParams()
  const credentialFromURL = searchParams.get('credentialId')

  const handleGenerate = () => {
    const newId = uuidv4().split('-')[0]
    const newCredential = {
      id: newId,
      name,
      role,
      date,
      issue,
      expiry
    }
    setCredentials([...credentials, newCredential])
    setCredentialId(newId)
    setSubmitted(true)
  }

  const handleDelete = (idToDelete) => {
    setCredentials(credentials.filter(c => c.id !== idToDelete))
  }

  if (credentialFromURL) {
    return <CredentialViewer id={credentialFromURL} />
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Credential Generator</h2>

          <Input placeholder="Recipient Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Role (e.g., Peer Reviewer)" value={role} onChange={e => setRole(e.target.value)} />
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <Input type="date" placeholder="Expiry Date (optional)" value={expiry} onChange={e => setExpiry(e.target.value)} />
          <Textarea placeholder="Journal Issue or Description" value={issue} onChange={e => setIssue(e.target.value)} />

          <Button onClick={handleGenerate}>Generate Credential</Button>
        </CardContent>
      </Card>

      {submitted && (
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Credential Generated</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Role:</strong> {role}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Journal Info:</strong> {issue}</p>
            <p><strong>Expiry:</strong> {expiry || 'None'}</p>
            <p><strong>Credential ID:</strong> {credentialId}</p>
            <p><strong>Credential URL:</strong> https://yourjournal.org/credentials/{credentialId}</p>
          </CardContent>
        </Card>
      )}

      {credentials.length > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">All Credentials</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.role}</TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>{c.expiry || '—'}</TableCell>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelete(c.id)} variant="destructive">Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
