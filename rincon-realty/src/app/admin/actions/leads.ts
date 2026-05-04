'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { ContactStatus, CommissionStatus } from '@/types'

export async function updateLeadStatus(id: string, status: ContactStatus) {
  const { error } = await supabaseAdmin
    .from('contacts')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function updateCommissionStatus(id: string, commissionStatus: CommissionStatus) {
  const { error } = await supabaseAdmin
    .from('contacts')
    .update({ commission_status: commissionStatus })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/leads')
  return { success: true }
}
