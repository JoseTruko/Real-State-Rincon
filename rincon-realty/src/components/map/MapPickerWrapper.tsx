'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type MapPicker from './MapPicker'

const MapPickerDynamic = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-72 rounded-xl bg-neutral-100 animate-pulse" />,
})

export default function MapPickerWrapper(props: ComponentProps<typeof MapPicker>) {
  return <MapPickerDynamic {...props} />
}
