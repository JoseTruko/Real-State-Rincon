import type { Contact } from '@/types'

// Email sending is disabled until a production domain and email are configured.
// All leads are saved to the database and visible in the admin dashboard.
export async function sendLeadNotification(_contact: Contact): Promise<void> {
  return
}
