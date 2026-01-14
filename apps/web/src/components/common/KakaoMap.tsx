'use client';

import { useEffect, useRef } from 'react';

interface KakaoMapProps {
    address: string;
    title: string;
    level?: number;
    className?: string;
}

declare global {
    interface Window {
        kakao: any;
    }
}

export default function KakaoMap({ address, title, level = 3, className }: KakaoMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        // 실제 운영 시에는 환경 변수에서 앱 키를 가져와야 합니다.
        // process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
        const KAKAO_KEY = 'YOUR_KAKAO_APP_KEY';
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
        script.async = true;

        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                if (!mapRef.current) return;

                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: level,
                };

                const map = new window.kakao.maps.Map(mapRef.current, options);
                const geocoder = new window.kakao.maps.services.Geocoder();

                // 주소로 좌표를 검색합니다
                geocoder.addressSearch(address, (result: any, status: any) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                        // 결과값으로 받은 위치를 마커로 표시합니다
                        const marker = new window.kakao.maps.Marker({
                            map: map,
                            position: coords,
                        });

                        // 인포윈도우로 장소에 대한 설명을 표시합니다
                        const infowindow = new window.kakao.maps.InfoWindow({
                            content: `<div style="width:150px;text-align:center;padding:6px 0;font-size:12px;font-weight:600;">${title}</div>`,
                        });
                        infowindow.open(map, marker);

                        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                        map.setCenter(coords);
                    }
                });
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [address, title, level]);

    return (
        <div
            ref={mapRef}
            className={className}
            style={{ width: '100%', height: '100%', minHeight: '300px', borderRadius: '12px', overflow: 'hidden' }}
        >
            {!address && (
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', background: '#f3f4f6', color: '#9ca3af' }}>
                    주소 정보를 찾을 수 없습니다.
                </div>
            )}
        </div>
    );
}
