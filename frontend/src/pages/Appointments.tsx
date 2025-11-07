import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  appointmentsApi,
  customersApi,
  staffApi,
  servicesApi,
} from '@/lib/api'
import type { Appointment, AppointmentStatus } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function Appointments() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null)

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsApi.getAll(),
  })

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

  const deleteMutation = useMutation({
    mutationFn: appointmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete appointment')
    },
  })

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteMutation.mutate(id)
    }
  }

  const getCustomerName = (id: string) => {
    const customer = customers?.find((c) => c.id === id)
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown'
  }

  const getStaffName = (id: string) => {
    const staffMember = staff?.find((s) => s.id === id)
    return staffMember
      ? `${staffMember.first_name} ${staffMember.last_name}`
      : 'Unknown'
  }

  const getServiceName = (id: string) => {
    const service = services?.find((s) => s.id === id)
    return service?.name || 'Unknown'
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no_show':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">
            Manage your cleaning appointments
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAppointment(null)
            setIsModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Schedule Appointment
        </button>
      </div>

      {isLoading ? (
        <div className="card">Loading...</div>
      ) : appointments && appointments.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Date & Time</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Staff</th>
                  <th className="text-left py-3 px-4">Service</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      {new Date(appointment.scheduled_date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {getCustomerName(appointment.customer_id)}
                    </td>
                    <td className="py-3 px-4">
                      {getStaffName(appointment.staff_id)}
                    </td>
                    <td className="py-3 px-4">
                      {getServiceName(appointment.service_id)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center text-gray-600">
          No appointments found. Schedule your first appointment!
        </div>
      )}

      {isModalOpen && (
        <AppointmentModal
          appointment={editingAppointment}
          customers={customers || []}
          staff={staff || []}
          services={services || []}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

function AppointmentModal({
  appointment,
  customers,
  staff,
  services,
  onClose,
}: {
  appointment: Appointment | null
  customers: any[]
  staff: any[]
  services: any[]
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const formatDateForInput = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toISOString().slice(0, 16)
  }

  const [formData, setFormData] = useState({
    customer_id: appointment?.customer_id || '',
    staff_id: appointment?.staff_id || '',
    service_id: appointment?.service_id || '',
    scheduled_date: formatDateForInput(appointment?.scheduled_date) || '',
    status: appointment?.status || 'scheduled',
    notes: appointment?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: (data: any) =>
      appointment
        ? appointmentsApi.update(appointment.id.toString(), data)
        : appointmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success(
        appointment
          ? 'Appointment updated successfully'
          : 'Appointment created successfully'
      )
      onClose()
    },
    onError: () => {
      toast.error('Failed to save appointment')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      customer_id: formData.customer_id,
      staff_id: formData.staff_id,
      service_id: formData.service_id,
      scheduled_date: new Date(formData.scheduled_date).toISOString(),
    }
    mutation.mutate(submitData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {appointment ? 'Edit Appointment' : 'Schedule Appointment'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Customer</label>
              <select
                required
                className="input"
                value={formData.customer_id}
                onChange={(e) =>
                  setFormData({ ...formData, customer_id: e.target.value })
                }
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Staff Member</label>
              <select
                required
                className="input"
                value={formData.staff_id}
                onChange={(e) =>
                  setFormData({ ...formData, staff_id: e.target.value })
                }
              >
                <option value="">Select a staff member</option>
                {staff
                  .filter((s) => s.is_active)
                  .map((staffMember) => (
                    <option key={staffMember.id} value={staffMember.id}>
                      {staffMember.first_name} {staffMember.last_name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="label">Service</label>
              <select
                required
                className="input"
                value={formData.service_id}
                onChange={(e) =>
                  setFormData({ ...formData, service_id: e.target.value })
                }
              >
                <option value="">Select a service</option>
                {services
                  .filter((s) => s.is_active)
                  .map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${Number(service.price).toFixed(2)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="label">Date & Time</label>
              <input
                type="datetime-local"
                required
                className="input"
                value={formData.scheduled_date}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                className="input"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary">
                {appointment ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
