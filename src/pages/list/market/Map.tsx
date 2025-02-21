import React, { useState, useEffect, useRef } from 'react';
import styles from './style/map.module.less';

const TMapAPIKey = 'Y6FBZ-DUOLQ-TDY5C-2C3NN-RQQYO-4SBHB'; // 在这里填入您的腾讯地图API key

const MapComponent = ({ positionData, onGetPosition }, ref) => {
  const [center, setCenter] = useState(positionData);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // 加载腾讯地图API
    const script = document.createElement('script');
    script.src = `https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${TMapAPIKey}`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);
  }, []);

  const initMap = () => {
    const map = new TMap.Map(mapRef.current, {
      zoom: 14,
      center: new TMap.LatLng(center.lat, center.lng),
    });

    const marker = new TMap.MultiMarker({
      map: map,
      styles: {
        // 点标记样式
        marker: new TMap.MarkerStyle({
          width: 20, // 样式宽
          height: 30, // 样式高
          anchor: { x: 10, y: 30 }, // 描点位置
        }),
      },
      geometries: [
        // 点标记数据数组
        {
          // 标记位置(纬度，经度，高度)
          position: new TMap.LatLng(center.lat, center.lng),
          id: 'marker',
        },
      ],
    });

    // 点击地图添加点
    map.on('click', (evt) => {
      setCenter({
        lat: evt.latLng.lat,
        lng: evt.latLng.lng,
      });
    });

    setMap(map);
    setMarker(marker);
  };

  return (
    <div
      className={styles['demo-box']}
      ref={mapRef}
      style={{ width: '100%', height: '100vh' }}
    ></div>
  );
};

export default MapComponent;
