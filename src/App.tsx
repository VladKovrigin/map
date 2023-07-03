import React, { useState } from 'react';
import Map from './components/Map';
import { IPoint } from './interfaces/IPoint';
import PointList from './components/PointList';

export default function App() {
  const [points, setPoints] = useState<IPoint[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const handleMapClick = (point: IPoint) => {
    const existingPoint = points.find((pointItem) => (
        pointItem.lat === point.lat && pointItem.lng === point.lng
    ));

    if (existingPoint) {
      setSelectedPointId(existingPoint.id);
    } else {
      setPoints([...points, point]);
      setSelectedPointId(point.id);
    }
  };

  const handleMarkerClick = (point: IPoint) => {
    setSelectedPointId(point.id);

    console.log('Marker clicked:', point);
  };

  const handlePointEdit = (point: IPoint) => {
    const updatedPoints = points.map(pointItem => (
        pointItem.id === point.id ? point : pointItem
    ));

    setPoints(updatedPoints);
  };

  const handlePointDelete = (pointId: string) => {
    const updatedPoints = points.filter((point) => point.id !== pointId);

    setPoints(updatedPoints);
    setSelectedPointId(null);
  };

  const handleObjectAdd = (pointId: string, objectName: string) => {
    const updatedPoints = points.map(point => {
      if (point.id === pointId) {
        return {
          ...point,
          objects: [...point.objects, objectName],
        };
      }

      return point;
    });

    setPoints(updatedPoints);
  };

  const handleObjectDelete = (pointId: string, objectName: string) => {
    const updatedPoints = points.map((point) => {
      if (point.id === pointId) {
        return {
          ...point,
          objects: point.objects.filter((object: string) => object !== objectName),
        };
      }

      return point;
    });

    setPoints(updatedPoints);
  };

  return (
      <div className="app d-flex m-3 row">
        <PointList
            points={points}
            selectedPointId={selectedPointId}
            onPointSelect={setSelectedPointId}
        />
        <Map
            points={points}
            clickMap={handleMapClick}
            clickMarker={handleMarkerClick}
            selectedPointId={selectedPointId}
            selectPoint={setSelectedPointId}
            editPoint={handlePointEdit}
            deletePoint={handlePointDelete}
            addObject={handleObjectAdd}
            updateObject={() => {}}
            deleteObject={handleObjectDelete}
        />
      </div>
  );
}
