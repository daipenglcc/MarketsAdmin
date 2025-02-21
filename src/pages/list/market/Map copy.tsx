/*
 * @Descripttion:
 * @version: 1.0.1
 * @Author: daipeng
 * @Date: 2025-02-20 19:52:52
 * @LastEditors: daipeng
 * @LastEditTime: 2025-02-20 19:52:52
 */
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

const MapIndex = ({ positionData, onGetPosition }) => {
  const mapRef = useRef<any>();
  const [center, setCenter] = useState(positionData);
  const [geometries, setGeometries] = useState([
    {
      styleId: 'multiMarkerStyle1',
      position: positionData,
    },
  ]);

  /**
   * 地图点击事件处理器
   * @param event
   */
  const clickHandler = useCallback(
    (event: any) => {
      console.log('🚀🚀🚀 地图点击事件', event);
      const { lat, lng } = event.latLng;
      setCenter({ lat, lng });
      setGeometries([
        {
          styleId: 'multiMarkerStyle1',
          position: { lat, lng },
        },
      ]);
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
