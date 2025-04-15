'use client';
import useHoverAreaStore from '@/store/hoverArea';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    naver: typeof import('naver-maps')
  }
}

interface GeoJsonFeature {
  type : string 
  properties : {
    name : string // 지역 이름 
  }
  geometry : {
    type : string 
    coordinates : number[][][] // 좌표 배열 (다각형의 경우)
  }
}

const NaverMap = () => {
  const mapRef = useRef<HTMLDivElement>(null); // HTMLDivElement가 뭐지 
  const { setHoverArea } = useHoverAreaStore() 

  useEffect(() => {
    const initMap = async () => {
      const { naver } = window;

      const map = new naver.maps.Map(mapRef.current, {
        zoom: 13, // 서울 전체를 볼 수 있도록 줌 레벨 조정
        center: new naver.maps.LatLng(37.563, 126.997), // 서울 중심점
        mapTypeId: 'normal',
      });

      const tooltip = document.createElement('div');
      tooltip.style.cssText = 'position:absolute;z-index:1000;padding:5px 10px;background:#fff;border:2px solid #000;font-size:14px;pointer-events:none;display:none;';
      map.getPanes().floatPane.appendChild(tooltip);

      const startDataLayer = (geojson: any) => {
        map.data.setStyle((feature: any) => {
          let styleOptions = {
            fillColor: '#ff0000',
            fillOpacity: 0.0001,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 0.4,
          };

          if (feature.getProperty('focus')) {
            styleOptions = {
              fillColor: '#0f0',
              fillOpacity: 0.6,
              strokeColor: '#0f0',
              strokeWeight: 4,
              strokeOpacity: 1,
            };
          }

          return styleOptions;
        });

        // 데이터 추가
        map.data.addGeoJson(geojson);

        map.data.addListener('click', (e: any) => {
          const feature = e.feature;
          feature.setProperty('focus', !feature.getProperty('focus'));
        });

        map.data.addListener('mouseover', (e: any) => {
          const feature = e.feature;
          // 구 이름을 properties에서 가져오기
          const regionName = feature.getProperty('name') || feature.getId() || '';
          setHoverArea(regionName)
          tooltip.innerText = regionName;
          tooltip.style.display = 'block';
          tooltip.style.left = `${e.offset.x}px`;
          tooltip.style.top = `${e.offset.y}px`;

          map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1,
          });
        });

        map.data.addListener('mouseout', (e: any) => {
          tooltip.style.display = 'none';
          map.data.revertStyle();
        });
      };

      // 서울시 구 경계 데이터 로드
      try {
        const response = await fetch('/data/seoul_districts.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const geojson = await response.json();
        startDataLayer(geojson);
      } catch (error) {
        console.error('서울시 구 경계 데이터 로드 실패:', error);
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

export default NaverMap;