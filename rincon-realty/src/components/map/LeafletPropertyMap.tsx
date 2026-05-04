'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Coordinates } from '@/types'

// Fix default marker icons broken by webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng]) }, [lat, lng, map])
  return null
}

interface Props {
  coordinates: Coordinates
  title: string
  zoom?: number
  showApproximateCircle?: boolean
}

export default function LeafletPropertyMap({ coordinates, title, zoom = 14, showApproximateCircle = true }: Props) {
  const { lat, lng } = coordinates

  return (
    <div className="flex flex-col gap-2">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        className="w-full h-64 rounded-xl overflow-hidden"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={lat} lng={lng} />
        <Marker position={[lat, lng]} title={title} />
        {showApproximateCircle && (
          <Circle
            center={[lat, lng]}
            radius={500}
            pathOptions={{ color: '#1A5276', fillColor: '#1A5276', fillOpacity: 0.1, weight: 1 }}
          />
        )}
      </MapContainer>
      {showApproximateCircle && (
        <p className="text-xs text-neutral-500 text-center">Ubicación aproximada.</p>
      )}
    </div>
  )
}
