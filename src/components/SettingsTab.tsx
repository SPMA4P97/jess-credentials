
import OrganizationManager from './OrganizationManager'
import RoleManager from './RoleManager'

interface SettingsTabProps {
  organizations: string[]
  setOrganizations: (orgs: string[]) => void
  roles: string[]
  setRoles: (roles: string[]) => void
}

export default function SettingsTab({ 
  organizations, 
  setOrganizations, 
  roles, 
  setRoles 
}: SettingsTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      
      <div className="space-y-6">
        <OrganizationManager 
          organizations={organizations}
          setOrganizations={setOrganizations}
        />
        
        <RoleManager 
          roles={roles}
          setRoles={setRoles}
        />
      </div>
    </div>
  )
}
