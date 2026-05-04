'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type LeafletPropertyMap from './LeafletPropertyMap'

const LeafletMap = dynamic(() => import('./LeafletPropertyMap'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-xl bg-neutral-100 animate-pulse" />,
})

export default function PropertyMap(props: ComponentProps<typeof LeafletPropertyMap>) {
  return <LeafletMap {...props} />
}
