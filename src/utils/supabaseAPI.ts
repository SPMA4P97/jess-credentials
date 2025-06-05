
const SUPABASE_URL = "https://fryjsygqdvcuaabjerag.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeWpzeWdxZHZjdWFhYmplcmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNTkwOTUsImV4cCI6MjA2NDczNTA5NX0.aZEVYE6IDjh_0LY9lETfAkHKx1d7xY0Sk2TLi-FUKds"

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
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
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
