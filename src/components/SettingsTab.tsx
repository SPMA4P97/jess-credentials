
import OrganizationManager from './OrganizationManager'
import RoleManager from './RoleManager'
import UserManager from './UserManager'

interface User {
  id: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

interface SettingsTabProps {
  organizations: string[]
  setOrganizations: (orgs: string[]) => void
  roles: string[]
  setRoles: (roles: string[]) => void
  users: User[]
  setUsers: (users: User[]) => void
  currentUser: User
}

export default function SettingsTab({ 
  organizations, 
  setOrganizations, 
  roles, 
  setRoles,
  users,
  setUsers,
  currentUser
}: SettingsTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      
      <div className="space-y-6">
        <UserManager 
          users={users}
          setUsers={setUsers}
          currentUser={currentUser}
        />
        
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
