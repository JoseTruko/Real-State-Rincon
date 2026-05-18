'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places'],
    })

    loader.load().then(() => {
      if (!mapRef.current) return

      const initialCenter = { lat: lat || 10.55, lng: lng || -85.72 }

      const map = new google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 14,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      })
      mapInstanceRef.current = map

      const marker = new google.maps.Marker({
        map,
        position: initialCenter,
        draggable: true,
      })
      markerRef.current = marker

      marker.addListener('dragend', () => {
        const pos = marker.getPosition()!
        onChange(parseFloat(pos.lat().toFixed(6)), parseFloat(pos.lng().toFixed(6)))
      })

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return
        marker.setPosition(e.latLng)
        onChange(parseFloat(e.latLng.lat().toFixed(6)), parseFloat(e.latLng.lng().toFixed(6)))
      })

      if (searchRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchRef.current, {
          fields: ['geometry', 'name'],
        })
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry?.location) return
          const loc = place.geometry.location
          map.setCenter(loc)
          map.setZoom(16)
          marker.setPosition(loc)
          onChange(parseFloat(loc.lat().toFixed(6)), parseFloat(loc.lng().toFixed(6)))
        })
      }
    }).catch(() => {
      setError('No se pudo cargar Google Maps. Verifica que NEXT_PUBLIC_GOOGLE_MAPS_API_KEY esté configurada.')
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external lat/lng changes (e.g. form reset or edit mode load)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !lat || !lng) return
    const pos = new google.maps.LatLng(lat, lng)
    markerRef.current.setPosition(pos)
    mapInstanceRef.current.setCenter(pos)
  }, [lat, lng])

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={searchRef}
        type="text"
        placeholder="Buscar dirección, lugar..."
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {error ? (
        <div className="w-full h-96 rounded-xl bg-red-50 flex items-center justify-center text-sm text-red-600 border border-red-200 p-4 text-center">
          {error}
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-96 rounded-xl overflow-hidden border border-neutral-200" />
      )}

      <p className="text-xs text-neutral-500">
        Busca una dirección, haz click en el mapa o arrastra el pin para marcar la ubicación.
      </p>

      <div className="flex gap-4 text-xs text-neutral-600 font-mono bg-neutral-50 rounded-lg px-3 py-2">
        <span>Lat: <strong>{lat || '—'}</strong></span>
        <span>Lng: <strong>{lng || '—'}</strong></span>
      </div>
    </div>
  )
}
