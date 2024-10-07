"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

interface MapComponentProps {
  onAreaMarked: (info: { area: number; center: [number, number] }) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onAreaMarked }) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!mapRef.current) {
        mapRef.current = L.map('map').setView([39.9042, 116.4074], 10); // 北京市中心

        L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
          subdomains: ["1", "2", "3", "4"],
          attribution: '© 高德地图'
        }).addTo(mapRef.current);

        drawnItemsRef.current = new L.FeatureGroup();
        mapRef.current.addLayer(drawnItemsRef.current);

        const drawControl = new L.Control.Draw({
          edit: {
            featureGroup: drawnItemsRef.current,
            remove: false
          },
          draw: {
            polygon: true,
            polyline: false,
            rectangle: true,
            circle: false,
            circlemarker: false,
            marker: false
          }
        });

        mapRef.current.addControl(drawControl);

        mapRef.current.on(L.Draw.Event.CREATED, (e: any) => {
          const layer = e.layer;
          drawnItemsRef.current?.clearLayers();
          drawnItemsRef.current?.addLayer(layer);

          const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          const center = layer.getBounds().getCenter();

          onAreaMarked({
            area: area / 1000000, // 转换为平方公里
            center: [center.lat, center.lng]
          });
        });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onAreaMarked]);

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
};

export default MapComponent;