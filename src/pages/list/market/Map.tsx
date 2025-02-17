import React, { useCallback, useRef, useState, useEffect } from 'react';
import { TMap } from 'tlbs-map-react';
import styles from './style/map.module.less';

const MapIndex = ({ onGetPosition }) => {
  const mapRef = useRef<any>();
  const [center, setCenter] = useState({ lat: 40.0404, lng: 116.2735 });
  const [showControl, setShowControl] = useState(true);

  /**
   * 地图点击事件处理器
   * @param event
   */
  const clickHandler = useCallback((event: TMap.MapEvent) => {
    console.log('🚀🚀🚀 地图点击事件', event);
  }, []);

  // 添加错误处理逻辑
  const handleError = (error: any) => {
    console.error('地图加载错误:', error);
  };

  return (
    <div className={styles['demo-box']}>
      <TMap
        ref={mapRef}
        apiKey="Y6FBZ-DUOLQ-TDY5C-2C3NN-RQQYO-4SBHB"
        control={{
          zoom: {
            position: 'topRight',
            className: 'tmap-zoom-control-box',
            numVisible: true,
          },
        }}
        options={{
          center,
          zoom: 17,
          showControl,
        }}
        onClick={clickHandler}
        onError={handleError}
      />
    </div>
  );
};

export default MapIndex;
