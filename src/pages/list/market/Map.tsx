import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styles from './style/map.module.less';

const TMapAPIKey = 'Y6FBZ-DUOLQ-TDY5C-2C3NN-RQQYO-4SBHB'; // 在这里填入您的腾讯地图API key

interface MapComponentProps {
  positionData: { lat: string; lng: string }; // 定义 positionData 的类型
  onGetPosition: (position: { lat: number; lng: number }) => void; // 定义 onGetPosition 的类型
}

const MapComponent = forwardRef(
  ({ positionData, onGetPosition }: MapComponentProps, ref) => {
    const mapRef = useRef(null);
    const [center, setCenter] = useState(positionData);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [suggest, setSuggest] = useState(null);
    const [search, setSearch] = useState(null);
    // const suggest = useRef(null);
    // const search = useRef(null);

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
        zoom: 17,
        center: new TMap.LatLng(center.lat, center.lng),
      });

      const marker = new TMap.MultiMarker({
        map: map,
        styles: {
          // 点标记样式
          style1: new TMap.MarkerStyle({
            width: 20, // 样式宽
            height: 30, // 样式高
            anchor: { x: 10, y: 30 }, // 描点位置
          }),
        },
        geometries: [
          // 点标记数据数组
          {
            id: 'marker1',
            styleId: 'style1', //指定样式id
            position: new TMap.LatLng(center.lat, center.lng), //点标记坐标位置
          },
        ],
      });

      // 点击地图添加点
      map.on('click', (evt) => {
        setCenter({
          lat: evt.latLng.lat,
          lng: evt.latLng.lng,
        });

        // 将经纬度传递给父组件
        onGetPosition({ lat: evt.latLng.lat, lng: evt.latLng.lng });

        //修改地图中心点
        // map.setCenter(new TMap.LatLng(evt.latLng.lat, evt.latLng.lng));

        //修改 id 为 marker1 的点标记的位置
        marker.updateGeometries([
          {
            styleId: 'style1',
            id: 'marker1',
            position: new TMap.LatLng(evt.latLng.lat, evt.latLng.lng),
          },
        ]);
      });

      setMap(map);
      setMarker(marker);

      // 创建关键字输入提示类
      const suggest = new TMap.service.Suggestion({
        pageSize: 10,
        // region: '北京', // 限制城市范围
        // regionFix: true,
      });

      // 创建搜索类
      const search = new TMap.service.Search({ pageSize: 10 });

      setSearch(search);
      setSuggest(suggest);
    };

    // 地图搜索

    const searchByKeyword = () => {
      console.log('positionData', positionData);
      marker.setGeometries([]);
      search
        .searchRectangle({
          keyword: '天安门',
          bounds: map.getBounds(),
        })
        .then((result) => {
          console.log('result', result);
          return;
        });
    };

    useImperativeHandle(ref, () => ({
      searchByKeyword, // 暴露方法
    }));

    return (
      <div
        className={styles['demo-box']}
        ref={mapRef}
        style={{ width: '100%', height: '100vh' }}
      ></div>
    );
  }
);

export default MapComponent;
