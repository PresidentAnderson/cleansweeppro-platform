import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { staffApi } from '@/lib/api'
import type { Staff } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function StaffPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffApi.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: staffApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success('Staff member deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete staff member')
    },
  })

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-600 mt-2">Manage your team members</p>
        </div>
        <button
          onClick={() => {
            setEditingStaff(null)
            setIsModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Staff Member
        </button>
      </div>

      {isLoading ? (
        <div className="card">Loading...</div>
      ) : staff && staff.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Position</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="py-3 px-4">{member.position}</td>
                    <td className="py-3 px-4">{member.email}</td>
                    <td className="py-3 px-4">{member.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
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
          No staff members found. Add your first team member!
        </div>
      )}

      {isModalOpen && (
        <StaffModal staff={editingStaff} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

function StaffModal({
  staff,
  onClose,
}: {
  staff: Staff | null
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    first_name: staff?.first_name || '',
    last_name: staff?.last_name || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    position: staff?.position || '',
    hourly_rate: staff?.hourly_rate?.toString() || '',
    is_active: staff?.is_active ?? true,
    address: staff?.address || '',
    city: staff?.city || '',
    state: staff?.state || '',
    zip_code: staff?.zip_code || '',
    notes: staff?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: (data: any) =>
      staff ? staffApi.update(staff.id.toString(), data) : staffApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success(
        staff ? 'Staff member updated successfully' : 'Staff member created successfully'
      )
      onClose()
    },
    onError: () => {
      toast.error('Failed to save staff member')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
    }
    mutation.mutate(submitData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {staff ? 'Edit Staff Member' : 'Add Staff Member'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  required
                  className="input"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Position</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Hourly Rate</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, hourly_rate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: e.target.value === 'active',
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
                {staff ? 'Update' : 'Create'}
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
