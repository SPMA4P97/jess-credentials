
const SUPABASE_URL = "https://fryjsygqdvcuaabjerag.supabase.co"

export const createCredentialInSupabase = async (credentialData: {
  id: string
  created_at: string
  organization_name: string
  role: string
  issue_date: string
  expiry_date: string
  volumes: string
  info: string
  public_credential_url: string
}) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(credentialData)
    })

    if (!response.ok) {
      throw new Error(`Failed to create credential: ${response.statusText}`)
    }

    console.log('Credential successfully saved to Supabase')
    return true
  } catch (error) {
    console.error('Error saving credential to Supabase:', error)
    return false
  }
}
