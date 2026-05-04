import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations/contact'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendLeadNotification } from '@/lib/email/mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Honeypot check — discard silently if filled
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ success: true })
    }

    // 2. Validate with Zod
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) fields[String(e.path[0])] = e.message
      })
      return NextResponse.json(
        { success: false, error: 'validation_error', fields },
        { status: 400 }
      )
    }

    const { name, email, phone, message, property_id, agent_id, source } = parsed.data

    // 3. INSERT into contacts using service_role (bypasses RLS)
    const { data: contact, error: dbError } = await supabaseAdmin
      .from('contacts')
      .insert({
        name,
        email,
        phone: phone ?? null,
        message,
        property_id: property_id ?? null,
        agent_id: agent_id ?? null,
        source,
        status: 'new',
        commission_status: 'none',
      })
      .select()
      .single()

    if (dbError) {
      console.error('[/api/contact] DB error:', dbError.message)
      return NextResponse.json(
        { success: false, error: 'server_error' },
        { status: 500 }
      )
    }

    // 4 & 5 & 6. Send emails (non-blocking — failure does not revert the lead)
    sendLeadNotification(contact).catch((err) => {
      console.error('[/api/contact] Email error:', err)
    })

    // 7. Return success
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/contact] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}
