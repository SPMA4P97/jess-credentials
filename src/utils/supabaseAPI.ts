
const SUPABASE_URL = "https://fryjsygqdvcuaabjerag.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeWpzeWdxZHZjdWFhYmplcmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNTkwOTUsImV4cCI6MjA2NDczNTA5NX0.aZEVYE6IDjh_0LY9lETfAkHKx1d7xY0Sk2TLi-FUKds"

export const createCredentialInSupabase = async (credentialData: {
  id: string
  created_at: string
  organization_name: string
  name: string
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

export const fetchAllCredentialsFromSupabase = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/credentials?select=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch credentials: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Credentials fetched from Supabase:', data)
    return data
  } catch (error) {
    console.error('Error fetching credentials from Supabase:', error)
    return []
  }
}

export const deleteCredentialFromSupabase = async (id: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/credentials?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to delete credential: ${response.statusText}`)
    }

    console.log('Credential successfully deleted from Supabase')
    return true
  } catch (error) {
    console.error('Error deleting credential from Supabase:', error)
    return false
  }
}

export const fetchCredentialByIdFromSupabase = async (id: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/credentials?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch credential: ${response.statusText}`)
    }

    const data = await response.json()
    return data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Error fetching credential from Supabase:', error)
    return null
  }
}
