'use client'

import 'leaflet/dist/leaflet.css'

import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'

import L from 'leaflet'

// Fix for default marker icon in Leaflet with Next.js - use local icons for better performance
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface MapComponentProps {
  latitude: number
  longitude: number
  zoom?: number
}

export default function MapComponent({ latitude, longitude, zoom = 10 }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Use state for retina detection to avoid hydration mismatch
  const [isRetina, setIsRetina] = useState(false)
  
  useEffect(() => {
    // Detect retina displays only on client side
    setIsRetina(window.devicePixelRatio > 1 || (L.Browser as any).retina)
  }, [])

  useEffect(() => {
    // Invalidate size when component mounts or updates
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize()
      }, 100)
    }
  }, [latitude, longitude])

  // Use CartoDB Positron tiles which are lighter and faster
  // Alternative: Stadia Maps with retina support
  const tileUrl = isRetina
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

  return (
    <MapContainer
      ref={mapRef}
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ height: '100%', width: '100%', minHeight: '128px' }}
      scrollWheelZoom={false}
      // Performance optimizations
      preferCanvas={true}
    >
      <TileLayer
        attribution={attribution}
        url={tileUrl}
        maxZoom={19}
        // Performance optimizations
        keepBuffer={2}
        tileSize={256}
        zoomOffset={0}
        // Crossorigin for better caching
        crossOrigin={true}
      />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  )
}
