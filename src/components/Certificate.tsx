
import { Card, CardContent } from "@/components/ui/card"
import { Award, Calendar, Shield, User } from 'lucide-react'
import { format } from 'date-fns'

interface CertificateProps {
  name: string
  role: string
  organization: string
  date: string
  issue: string
  credentialId: string
}

export default function Certificate({ name, role, organization, date, issue, credentialId }: CertificateProps) {
  const formattedDate = format(new Date(date), 'MMMM d, yyyy')

  return (
    <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full"></div>
      </div>

      <CardContent className="relative p-8 text-white space-y-6">
        {/* Header */}
        <div className="text-center border-b border-white/20 pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Award size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Digital Credential</h2>
          <p className="text-blue-100 text-lg">{organization}</p>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6">
          <div>
            <p className="text-blue-100 text-sm uppercase tracking-wide mb-2">This certifies that</p>
            <h3 className="text-3xl font-bold mb-4">{name}</h3>
            <p className="text-blue-100 text-sm uppercase tracking-wide mb-2">has successfully completed the role of</p>
            <p className="text-xl font-semibold text-blue-100">{role}</p>
          </div>

          {issue && (
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">{issue}</p>
            </div>
          )}

          {/* Footer Information */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} />
              <span>Issued: {formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield size={16} />
              <span>ID: {credentialId}</span>
            </div>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Shield size={12} />
            Verified
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
