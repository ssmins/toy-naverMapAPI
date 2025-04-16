// src/components/yangsanmap.tsx
import { useEffect, useRef } from 'react';
import $ from 'jquery';

const YangsanMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const { naver } = window;

      const map = new naver.maps.Map(mapRef.current, {
        zoom: 11,
        center: new naver.maps.LatLng(35.3, 129.0), // 양산시 중심 좌표
        mapTypeId: 'normal',
      });

      const tooltip = document.createElement('div');
      tooltip.style.cssText = 'position:absolute;z-index:1000;padding:5px 10px;background:#fff;border:2px solid #000;font-size:14px;pointer-events:none;display:none;';
      map.getPanes().floatPane.appendChild(tooltip);

      const startDataLayer = (geojson: { features: any[] }) => {
        map.data.setStyle((feature: any) => {
          return {
            fillColor: '#ff0000',
            fillOpacity: 0.5,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 0.4,
          };
        });

        map.data.addGeoJson(geojson);

        map.data.addListener('mouseover', (e: any) => {
          const feature = e.feature;
          const regionName = feature.getProperty('name') || feature.getId() || '';
          tooltip.innerText = regionName;
          tooltip.style.display = 'block';
          tooltip.style.left = `${e.offset.x}px`;
          tooltip.style.top = `${e.offset.y}px`;
        });

        map.data.addListener('mouseout', () => {
          tooltip.style.display = 'none';
        });
      };

      // 양산시 구 경계 데이터 로드
      try {
        const response = await fetch('/data/yangsan_districts.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const geojson = await response.json();
        startDataLayer(geojson);
      } catch (error) {
        console.error('양산시 구 경계 데이터 로드 실패:', error);
      }
    };

    if (window.naver) {
      initMap();
    } else {
      const script = document.createElement('script');
      const YOUR_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${YOUR_CLIENT_ID}`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, []);

  return <div ref={mapRef} id="map" style={{ width: '100%', height: '80vh' }} />;
};

export default YangsanMap;