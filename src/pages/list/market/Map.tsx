import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { List, Spin } from '@arco-design/web-react';
import styles from './style/map.module.less';

const TMapAPIKey = 'Y6FBZ-DUOLQ-TDY5C-2C3NN-RQQYO-4SBHB'; // 在这里填入您的腾讯地图API key

interface MapComponentProps {
  positionData: { lat: string; lng: string }; // 定义 positionData 的类型
  onGetPosition: (position: { lat: number; lng: number }) => void; // 定义 onGetPosition 的类型
}

const MapComponent = forwardRef(
  ({ positionData, onGetPosition }: MapComponentProps, ref) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [search, setSearch] = useState(null);

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
        center: new TMap.LatLng(positionData.lat, positionData.lng),
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
            position: new TMap.LatLng(positionData.lat, positionData.lng), //点标记坐标位置
          },
        ],
      });

      // 点击地图添加点
      map.on('click', (evt) => {
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

      // 创建搜索类
      const search = new TMap.service.Search({ pageSize: 10 });

      setMap(map);
      setMarker(marker);
      setSearch(search);
    };

    // 地图搜索
    const [areaList, setAreaList] = useState([]);
    const searchByKeyword = (searchByKeyword) => {
      if (!searchByKeyword) {
        return setAreaList([]);
      }
      // marker.setGeometries([]);
      search
        .searchRegion({
          keyword: searchByKeyword,
          cityName: '北京',
          // bounds: map.getBounds(),
        })
        .then((result) => {
          setAreaList(result.data);
          return;
        });
    };

    const toIP = (item) => {
      console.log('item', item);
      // 将经纬度传递给父组件
      onGetPosition({ lat: item.location.lat, lng: item.location.lng });
      // 修改地图中心点
      map.setCenter(new TMap.LatLng(item.location.lat, item.location.lng));
      // 设置缩放级别
      map.setZoom(17);
      //修改 id 为 marker1 的点标记的位置
      marker.updateGeometries([
        {
          styleId: 'style1',
          id: 'marker1',
          position: new TMap.LatLng(item.location.lat, item.location.lng),
        },
      ]);
    };

    useImperativeHandle(ref, () => ({
      searchByKeyword, // 暴露方法
    }));

    return (
      <>
        <div className={styles['map-box']} ref={mapRef}></div>
        {areaList.length > 0 && (
          <div className={styles['map-list']}>
            <List
              style={{ width: 200, maxHeight: 320 }}
              dataSource={areaList}
              bordered={true}
              render={(item, index) => (
                <List.Item
                  key={index}
                  style={{ height: 80 }}
                  onClick={() => toIP(item)}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={item.address}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </>
    );
  }
);

export default MapComponent;
