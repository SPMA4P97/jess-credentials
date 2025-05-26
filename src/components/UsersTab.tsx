
import UserTable from './UserTable'

interface User {
  id: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

interface UsersTabProps {
  users: User[]
  setUsers: (users: User[]) => void
  currentUser: User
}

export default function UsersTab({ users, setUsers, currentUser }: UsersTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <UserTable 
        users={users}
        setUsers={setUsers}
        currentUser={currentUser}
      />
    </div>
  )
}
