import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'

const trackSchema = z.object({
  source:      z.enum(['whatsapp', 'email_reveal']),
  property_id: z.string().uuid().optional(),
  agent_id:    z.string().uuid().optional(),
  name:        z.string().optional(),
  email:       z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = trackSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'validation_error' }, { status: 400 })
    }

    const { source, property_id, agent_id, name, email } = parsed.data

    // 1. INSERT into contacts
    const { error: dbError } = await supabaseAdmin
      .from('contacts')
      .insert({
        name:        name ?? 'Anonymous',
        email:       email ?? '',
        message:     '',
        source,
        property_id: property_id ?? null,
        agent_id:    agent_id ?? null,
        status:      'new',
        commission_status: 'none',
      })

    if (dbError) {
      console.error('[/api/track-contact] DB error:', dbError.message)
      // Non-critical — still return redirect_url
    }

    // 2. Build redirect URL
    let redirect_url = ''

    if (source === 'whatsapp') {
      // Fetch agent's WhatsApp number
      let whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
      if (agent_id) {
        const { data: agent } = await supabaseAdmin
          .from('agents')
          .select('whatsapp')
          .eq('id', agent_id)
          .single()
        if (agent?.whatsapp) whatsapp = agent.whatsapp
      }
      // If someone stored a full WhatsApp URL, extract the phone parameter
      const phoneParam = whatsapp.match(/[?&]phone=(\d+)/)?.[1]
      const cleanNumber = (phoneParam ?? whatsapp).replace(/[\s\-\+\(\)]/g, '')
      redirect_url = `https://wa.me/${cleanNumber}`
    } else if (source === 'email_reveal' && agent_id) {
      const { data: agent } = await supabaseAdmin
        .from('agents')
        .select('email')
        .eq('id', agent_id)
        .single()
      if (agent?.email) redirect_url = `mailto:${agent.email}`
    }

    // 3. Return success + redirect_url
    return NextResponse.json({ success: true, redirect_url })
  } catch (err) {
    console.error('[/api/track-contact] Unexpected error:', err)
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }
}
