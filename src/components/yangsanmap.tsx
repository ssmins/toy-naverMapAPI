'use client'

import { useEffect, useRef } from 'react';
import $ from 'jquery';

const YangsanMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const { naver } = window as any;

      const map = new naver.maps.Map(mapRef.current, {
        zoom: 11,
        center: new naver.maps.LatLng(35.3, 129.0), // 양산시 중심 좌표
        mapTypeId: 'normal',
      });

      const tooltip = document.createElement('div');
      tooltip.style.cssText = 'position:absolute;z-index:1000;padding:5px 10px;background:#fff;border:2px solid #000;font-size:14px;pointer-events:none;display:none;';
      map.getPanes().floatPane.appendChild(tooltip);

      // 지역별 색상 생성 함수
      const getRegionColor = (index: number) => {
        // 파스텔톤 색상 배열
        const colors = [
          '#E6F3FF', '#FFE6E6', '#E6FFE6', '#FFE6F3', 
          '#F3E6FF', '#E6FFF3', '#F3FFE6', '#FFE6FF',
          '#E6F3FF', '#FFE6E6', '#E6FFE6', '#FFE6F3'
        ];
        return colors[index % colors.length];
      };

      const startDataLayer = (geojson: { features: any[] }) => {
        // 기본 스타일 설정 - 투명하게 시작
        map.data.setStyle((feature: any) => {
          const index = feature.getId() || 0;
          return {
            fillColor: getRegionColor(index),
            fillOpacity: 0.3,
            strokeColor: '#555555',
            strokeWeight: 1,
            strokeOpacity: 0.7,
          };
        });

        // GeoJSON 데이터 추가
        map.data.addGeoJson(geojson);

        // 마우스 오버 이벤트
        map.data.addListener('mouseover', (e: any) => {
          const feature = e.feature;
          // adm_nm 속성에서 지역명 가져오기 (GeoJSON 데이터 구조에 맞게 수정)
          const regionName = feature.getProperty('adm_nm') || feature.getId() || '';
          
          // 툴팁에 지역명 표시
          tooltip.innerText = regionName;
          tooltip.style.display = 'block';
          tooltip.style.left = `${e.offset.x}px`;
          tooltip.style.top = `${e.offset.y}px`;
          
          // 마우스 오버 시 스타일 변경
          map.data.overrideStyle(feature, {
            fillOpacity: 0.7,
            strokeColor: '#000000',
            strokeWeight: 3,
            strokeOpacity: 1
          });
        });

        // 마우스 아웃 이벤트
        map.data.addListener('mouseout', (e: any) => {
          tooltip.style.display = 'none';
          // 원래 스타일로 복원
          map.data.revertStyle();
        });

        // 클릭 이벤트 (선택 사항)
        map.data.addListener('click', (e: any) => {
          const feature = e.feature;
          const regionName = feature.getProperty('adm_nm') || feature.getId() || '';
          console.log(`선택된 지역: ${regionName}`);
          
          // 여기에 클릭 시 추가 기능 구현 가능
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

    // 네이버 지도 API 로드
    if ((window as any).naver) {
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
