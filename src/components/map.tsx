'use client';

import { useEffect, useRef } from 'react';
import $ from 'jquery'; // jQuery 의존성 추가가 필요합니다

declare global {
  interface Window {
    naver: any;
    HOME_PATH?: string;
  }
}

const NaverMap2 = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      
      const { naver } = window;
      const HOME_PATH = window.HOME_PATH || '.';
      const urlPrefix = HOME_PATH + '/data/region';
      const urlSuffix = '.json';
      
      const regionGeoJson: any[] = [];
      let loadCount = 0;

      const map = new naver.maps.Map(mapRef.current, {
        zoom: 7,
        mapTypeId: 'normal',
        center: new naver.maps.LatLng(36.4203004, 128.317960)
      });

      // 툴팁 생성
      const tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
      tooltip.appendTo(map.getPanes().floatPane);
      tooltipRef.current = tooltip[0];

      const startDataLayer = () => {
        map.data.setStyle((feature: any) => {
          let styleOptions = {
            fillColor: '#ff0000',
            fillOpacity: 0.0001,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 0.4
          };

          if (feature.getProperty('focus')) {
            styleOptions = {
              ...styleOptions,
              fillOpacity: 0.6,
              fillColor: '#0f0',
              strokeColor: '#0f0',
              strokeWeight: 4,
              strokeOpacity: 1
            };
          }

          return styleOptions;
        });

        regionGeoJson.forEach((geojson) => {
          map.data.addGeoJson(geojson);
        });

        map.data.addListener('click', (e: any) => {
          const feature = e.feature;
          feature.setProperty('focus', !feature.getProperty('focus'));
        });

        map.data.addListener('mouseover', (e: any) => {
          const feature = e.feature;
          const regionName = feature.getProperty('area1');
          
          tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
          }).text(regionName);

          map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1
          });
        });

        map.data.addListener('mouseout', (e: any) => {
          tooltip.hide().empty();
          map.data.revertStyle();
        });
      };

      // 지역 데이터 로드
      naver.maps.Event.once(map, 'init', () => {
        for (let i = 1; i < 18; i++) {
          let keyword = i < 10 ? `0${i}` : `${i}`;
          
          $.ajax({
            url: urlPrefix + keyword + urlSuffix,
            success: ((idx: number) => {
              return (geojson: any) => {
                regionGeoJson[idx] = geojson;
                loadCount++;

                if (loadCount === 17) {
                  startDataLayer();
                }
              };
            })(i - 1),
            error: (error) => {
              console.error(`지역 ${keyword} 데이터 로드 실패:`, error);
              loadCount++;
              
              if (loadCount === 17) {
                startDataLayer();
              }
            }
          });
        }
      });
    };

    // Naver 지도 스크립트 로드
    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      const YOUR_CLIENT_ID = process.env.NEXT_PUBLIC_ACCESS_KEY; 
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${YOUR_CLIENT_ID}`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (tooltipRef.current) {
        $(tooltipRef.current).remove();
      }
    };
  }, []);

  return <div ref={mapRef} id="map" style={{ width: '100%', height: '80vh' }} />;
};

export default NaverMap2;