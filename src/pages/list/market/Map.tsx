import React, { useCallback, useRef, useState, useEffect } from 'react';
import { TMap, MultiMarker } from 'tlbs-map-react';
import styles2 from './style/map.module.less';

const styles = {
  multiMarkerStyle1: {
    width: 20,
    height: 30,
    anchor: { x: 10, y: 30 },
  },
};

const geometriesData1 = [
  {
    styleId: 'multiMarkerStyle1',
    position: { lat: 40.0404, lng: 116.2735 },
  },
];

const MapIndex = ({ onGetPosition }) => {
  const mapRef = useRef<any>();
  const [center, setCenter] = useState({ lat: 40.0404, lng: 116.2735 });
  const [showControl, setShowControl] = useState(true);
  const [geometries, setGeometries] = useState(geometriesData1);

  /**
   * 地图点击事件处理器
   * @param event
   */
  const clickHandler = useCallback(
    (event: any) => {
      console.log('🚀🚀🚀 地图点击事件', event);
      setGeometries(geometriesData1);
      const { lat, lng } = event.latLng;
      onGetPosition({ lat, lng }); // 将经纬度传递给父组件
    },
    [onGetPosition]
  );

  // 添加错误处理逻辑
  const handleError = (error: any) => {
    console.error('地图加载错误:', error);
  };

  return (
    <div className={styles2['demo-box']}>
      <TMap
        ref={mapRef}
        apiKey="Y6FBZ-DUOLQ-TDY5C-2C3NN-RQQYO-4SBHB"
        options={{
          center,
          zoom: 17,
          showControl,
        }}
        onClick={clickHandler}
        onError={handleError}
      >
        <MultiMarker styles={styles} geometries={geometries} />
      </TMap>
    </div>
  );
};

export default MapIndex;
