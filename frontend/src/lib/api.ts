import { supabase } from './supabase'

// Types
export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  notes?: string
  created_at: string
  updated_at?: string
}

export interface Staff {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  position: string
  hourly_rate?: number
  is_active: boolean
  hire_date?: string
  notes?: string
  created_at: string
  updated_at?: string
}

export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration_minutes: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export type AppointmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export interface Appointment {
  id: string
  customer_id: string
  staff_id: string
  service_id: string
  scheduled_date: string
  end_date?: string
  status: AppointmentStatus
  notes?: string
  internal_notes?: string
  created_at: string
  updated_at?: string
}

// Customers API
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  getById: async (id: string): Promise<Customer> => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  create: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single()

    if (error) throw error
    return data
  },

  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Staff API
export const staffApi = {
  getAll: async (activeOnly = false): Promise<Staff[]> => {
    let query = supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  getById: async (id: string): Promise<Staff> => {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  create: async (staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> => {
    const { data, error } = await supabase
      .from('staff')
      .insert([staff])
      .select()
      .single()

    if (error) throw error
    return data
  },

  update: async (id: string, staff: Partial<Staff>): Promise<Staff> => {
    const { data, error } = await supabase
      .from('staff')
      .update(staff)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Services API
export const servicesApi = {
  getAll: async (activeOnly = false): Promise<Service[]> => {
    let query = supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  getById: async (id: string): Promise<Service> => {
    const { data, error} = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  create: async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single()

    if (error) throw error
    return data
  },

  update: async (id: string, service: Partial<Service>): Promise<Service> => {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Appointments API
export const appointmentsApi = {
  getAll: async (filters?: {
    customer_id?: string
    staff_id?: string
    status?: AppointmentStatus
    start_date?: string
    end_date?: string
  }): Promise<Appointment[]> => {
    let query = supabase
      .from('appointments')
      .select('*')
      .order('scheduled_date', { ascending: false })

    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id)
    }
    if (filters?.staff_id) {
      query = query.eq('staff_id', filters.staff_id)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.start_date && filters?.end_date) {
      query = query
        .gte('scheduled_date', filters.start_date)
        .lte('scheduled_date', filters.end_date)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  getById: async (id: string): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  create: async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single()

    if (error) throw error
    return data
  },

  update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

export default supabase
