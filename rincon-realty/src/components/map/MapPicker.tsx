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
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    })

    async function init() {
      try {
        await loader.load()
        if (!mapRef.current) return

        const initialCenter = { lat: lat || 10.55, lng: lng || -85.72 }

        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary
        const { PlaceAutocompleteElement } = await google.maps.importLibrary('places') as any

        const map = new Map(mapRef.current, {
          center: initialCenter,
          zoom: 14,
          mapId: 'DEMO_MAP_ID',
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        })
        mapInstanceRef.current = map

        const marker = new AdvancedMarkerElement({
          map,
          position: initialCenter,
          gmpDraggable: true,
        })
        markerRef.current = marker

        marker.addListener('dragend', () => {
          const pos = marker.position as google.maps.LatLng
          onChange(parseFloat(pos.lat().toFixed(6)), parseFloat(pos.lng().toFixed(6)))
        })

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return
          marker.position = e.latLng
          onChange(parseFloat(e.latLng.lat().toFixed(6)), parseFloat(e.latLng.lng().toFixed(6)))
        })

        if (searchContainerRef.current) {
          const placeAutocomplete = new PlaceAutocompleteElement()
          searchContainerRef.current.appendChild(placeAutocomplete)

          placeAutocomplete.addEventListener('gmp-placeselect', async ({ place }: any) => {
            await place.fetchFields({ fields: ['location'] })
            if (!place.location) return
            const loc = place.location as google.maps.LatLng
            map.setCenter(loc)
            map.setZoom(16)
            marker.position = loc
            onChange(parseFloat(loc.lat().toFixed(6)), parseFloat(loc.lng().toFixed(6)))
          })
        }
      } catch {
        setError('No se pudo cargar Google Maps. Verifica que NEXT_PUBLIC_GOOGLE_MAPS_API_KEY esté configurada.')
      }
    }

    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external lat/lng changes (edit mode load or form reset)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !lat || !lng) return
    markerRef.current.position = { lat, lng }
    mapInstanceRef.current.setCenter({ lat, lng })
  }, [lat, lng])

  return (
    <div className="flex flex-col gap-2">
      <div ref={searchContainerRef} className="w-full [&>*]:w-full [&>*]:rounded-lg [&>*]:border [&>*]:border-neutral-300 [&>*]:text-sm" />

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
