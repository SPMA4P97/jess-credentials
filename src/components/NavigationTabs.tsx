
import { Button } from "@/components/ui/button"
import { FileText, Users, Settings } from 'lucide-react'

interface NavigationTabsProps {
  activeTab: 'credentials' | 'users' | 'settings'
  setActiveTab: (tab: 'credentials' | 'users' | 'settings') => void
  isAdmin: boolean
}

export default function NavigationTabs({ activeTab, setActiveTab, isAdmin }: NavigationTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex space-x-4">
        <Button
          variant={activeTab === 'credentials' ? 'default' : 'outline'}
          onClick={() => setActiveTab('credentials')}
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          Credentials
        </Button>
        {isAdmin && (
          <>
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2"
            >
              <Users size={16} />
              Users
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2"
            >
              <Settings size={16} />
              Settings
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
