'use client'

import 'leaflet/dist/leaflet.css'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [isRetina, setIsRetina] = useState(false)

  useEffect(() => {
    setIsRetina(window.devicePixelRatio > 1 || (L.Browser as any).retina)
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Create map using Leaflet directly to avoid react-leaflet strict mode issues
    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: zoom,
      scrollWheelZoom: false,
      preferCanvas: true,
    })

    mapRef.current = map

    // Add tile layer
    const tileUrl = isRetina
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      tileSize: 256,
      crossOrigin: true,
    }).addTo(map)

    // Add marker
    L.marker([latitude, longitude]).addTo(map)

    // Invalidate size after mount to handle accordion animations
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize()
      }
    }, 350)

    return () => {
      clearTimeout(timeoutId)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [latitude, longitude, zoom, isRetina])

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', width: '100%', minHeight: '128px' }}
    />
  )
}
