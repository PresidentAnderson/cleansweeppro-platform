import { useQuery } from '@tanstack/react-query'
import { customersApi, staffApi, servicesApi, appointmentsApi } from '@/lib/api'
import { Users, UserCog, Briefcase, Calendar } from 'lucide-react'

export default function Dashboard() {
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: customersApi.getAll,
  })

  const { data: staff } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffApi.getAll(),
  })

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  })

  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsApi.getAll(),
  })

  const stats = [
    {
      name: 'Total Customers',
      value: customers?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Staff',
      value: staff?.length || 0,
      icon: UserCog,
      color: 'bg-green-500',
    },
    {
      name: 'Services',
      value: services?.length || 0,
      icon: Briefcase,
      color: 'bg-purple-500',
    },
    {
      name: 'Appointments',
      value: appointments?.length || 0,
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ]

  const upcomingAppointments = appointments
    ?.filter((apt) => apt.status === 'scheduled')
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your cleaning service management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Appointments
        </h2>
        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Appointment #{appointment.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.scheduled_date).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming appointments</p>
        )}
      </div>
    </div>
  )
}
