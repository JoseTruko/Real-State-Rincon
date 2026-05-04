import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { PropertyPDF } from '@/lib/pdf/PropertyPDF'
import type { Locale } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const locale = (request.nextUrl.searchParams.get('locale') ?? 'en') as Locale

  // Fetch property with agent and images
  const { data: property, error } = await supabaseAdmin
    .from('properties')
    .select(`
      *,
      agent:agents(*),
      images:property_images(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  try {
    const buffer = await renderToBuffer(PropertyPDF({ property, locale }))

    const slug = locale === 'es' ? property.slug_es : property.slug_en

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="property-${slug}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[/api/properties/[id]/pdf] PDF generation error:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
