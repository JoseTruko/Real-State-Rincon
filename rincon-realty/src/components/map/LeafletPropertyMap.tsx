'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import type { Coordinates } from '@/types'

interface Props {
  coordinates: Coordinates
  title: string
  zoom?: number
  showApproximateCircle?: boolean
}

export default function LeafletPropertyMap({ coordinates, title, zoom = 14, showApproximateCircle = true }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const { lat, lng } = coordinates

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    })

    const center = { lat, lng }

    loader.load().then(() => {
      if (!mapRef.current) return

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        scrollwheel: false,
        gestureHandling: 'cooperative',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      new google.maps.Marker({
        map,
        position: center,
        title,
      })

      if (showApproximateCircle) {
        new google.maps.Circle({
          map,
          center,
          radius: 500,
          strokeColor: '#1A5276',
          strokeOpacity: 0.6,
          strokeWeight: 1,
          fillColor: '#1A5276',
          fillOpacity: 0.1,
        })
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-2">
      <div ref={mapRef} className="w-full h-64 rounded-xl overflow-hidden" />
      {showApproximateCircle && (
        <p className="text-xs text-neutral-500 text-center">Ubicación aproximada.</p>
      )}
    </div>
  )
}
