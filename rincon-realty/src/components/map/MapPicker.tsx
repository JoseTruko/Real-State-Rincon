'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(parseFloat(e.latlng.lat.toFixed(6)), parseFloat(e.latlng.lng.toFixed(6)))
    },
  })
  return null
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng]) }, [lat, lng, map])
  return null
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const markerRef = useRef<L.Marker>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await res.json()
      if (data[0]) {
        onChange(parseFloat(parseFloat(data[0].lat).toFixed(6)), parseFloat(parseFloat(data[0].lon).toFixed(6)))
      }
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Search box */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar dirección o lugar..."
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {searching ? '...' : 'Buscar'}
        </button>
      </form>

      {/* Map */}
      <MapContainer
        center={[lat || 10.55, lng || -85.72]}
        zoom={13}
        className="w-full h-72 rounded-xl overflow-hidden cursor-crosshair"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {lat && lng && <RecenterMap lat={lat} lng={lng} />}
        {lat && lng && (
          <Marker
            position={[lat, lng]}
            ref={markerRef}
            draggable
            eventHandlers={{
              dragend() {
                const pos = markerRef.current?.getLatLng()
                if (pos) onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)))
              },
            }}
          />
        )}
      </MapContainer>

      <p className="text-xs text-neutral-500">
        Haz click en el mapa o arrastra el pin para ajustar la ubicación.
      </p>

      {/* Coordinate display */}
      <div className="flex gap-4 text-xs text-neutral-600 font-mono bg-neutral-50 rounded-lg px-3 py-2">
        <span>Lat: <strong>{lat || '—'}</strong></span>
        <span>Lng: <strong>{lng || '—'}</strong></span>
      </div>
    </div>
  )
}
