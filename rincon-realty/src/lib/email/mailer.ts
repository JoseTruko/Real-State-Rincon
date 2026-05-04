import { Resend } from 'resend'
import { createElement } from 'react'
import { render } from '@react-email/components'
import { LeadNotification } from './templates/LeadNotification'
import { SITE_NAME } from '@/config/site'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Contact } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''
const FROM_EMAIL = `${SITE_NAME} <noreply@rinconrealty.com>`

/**
 * Sends lead notification emails to admin and agent.
 * Errors are caught and logged — email failure does NOT revert the lead.
 */
export async function sendLeadNotification(contact: Contact): Promise<void> {
  try {
    // Fetch related data for email context
    let propertyTitle: string | undefined
    let agentEmail: string | undefined
    let agentName: string | undefined

    if (contact.property_id) {
      const { data: property } = await supabaseAdmin
        .from('properties')
        .select('title_en')
        .eq('id', contact.property_id)
        .single()
      propertyTitle = property?.title_en
    }

    if (contact.agent_id) {
      const { data: agent } = await supabaseAdmin
        .from('agents')
        .select('email, full_name')
        .eq('id', contact.agent_id)
        .single()
      agentEmail = agent?.email
      agentName = agent?.full_name
    }

    const html = await render(
      createElement(LeadNotification, { contact, propertyTitle, agentName })
    )

    const subject = `New lead: ${contact.name}${propertyTitle ? ` — ${propertyTitle}` : ''}`

    // Send to admin
    if (ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject,
        html,
      })
    }

    // Send to agent (if different from admin)
    if (agentEmail && agentEmail !== ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: agentEmail,
        subject: `New inquiry for your property${propertyTitle ? `: ${propertyTitle}` : ''}`,
        html,
      })
    }
  } catch (err) {
    // Log but do not throw — email failure must not revert the lead
    console.error('[mailer] sendLeadNotification error:', err)
  }
}
