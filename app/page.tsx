"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
});

export default function Home() {
  const [areaInfo, setAreaInfo] = useState<{
    area: number;
    center: [number, number];
  } | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">地图标记工具</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <MapComponent onAreaMarked={setAreaInfo} />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>区域信息</CardTitle>
            </CardHeader>
            <CardContent>
              {areaInfo ? (
                <>
                  <p>面积: {areaInfo.area.toFixed(2)} 平方公里</p>
                  <p>中心纬度: {areaInfo.center[0].toFixed(6)}</p>
                  <p>中心经度: {areaInfo.center[1].toFixed(6)}</p>
                </>
              ) : (
                <p>在地图上标记一个区域以查看信息</p>
              )}
            </CardContent>
          </Card>
          <Button className="mt-4 w-full" onClick={() => setAreaInfo(null)}>
            清除标记
          </Button>
        </div>
      </div>
    </div>
  );
}