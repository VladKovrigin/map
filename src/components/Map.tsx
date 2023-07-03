import React, {useState, useEffect} from 'react';
import {nanoid} from 'nanoid';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import {IPoint} from "../interfaces/IPoint";
import ObjectList from './ObjectList';
import BaseInput from './BaseInput';
import BaseButton from './BaseButton';

interface MapProps {
    points: IPoint[];
    clickMap: (point: IPoint) => void;
    clickMarker: (point: IPoint) => void;
    selectedPointId: string | null;
    selectPoint: (pointId: string | null) => void;
    editPoint: (point: IPoint) => void;
    deletePoint: (pointId: string) => void;
    addObject: (pointId: string, objectName: string) => void;
    updateObject: (pointId: string, objectName: string | null) => void;
    deleteObject: (pointId: string, objectName: string) => void;
}

const containerStyle = {
    width: '100%',
    height: '700px',
    margin: '0 auto',
};

export default function Map({points, clickMap, clickMarker, selectedPointId, selectPoint, editPoint, deletePoint, addObject, deleteObject, updateObject}: MapProps) {

    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: 46.94809, lng: 7.44744
    });
    const zoom = 12
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDkCjccZ7hSox79AJux5kXN3mONVSQxYb0',
    });

    const [selectedPoint, setSelectedPoint] = useState<IPoint | null>(null);
    const [selectedPointObjects, setSelectedPointObjects] = useState<string[]>([]);
    const [localPoints, setLocalPoints] = useState<IPoint[]>([]);

    const [newObjectName, setNewObjectName] = useState('');
    const [selectedObjectName, setSelectedObjectName] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
            );
        }

        const savedPoints = localStorage.getItem('points');
        if (savedPoints) {
            const parsedPoints: IPoint[] = JSON.parse(savedPoints);
            if (parsedPoints.length > 0) {
                const lastSelectedPoint = parsedPoints.find((point) => point.id === selectedPoint?.id);
                setSelectedPoint(lastSelectedPoint || null);
                if (lastSelectedPoint) {
                    setSelectedPointObjects(lastSelectedPoint.objects);
                }
            }
            setLocalPoints(parsedPoints);
        }
    }, [selectedPoint?.id]);

    useEffect(() => {
        setLocalPoints(points);
    }, [points]);

    useEffect(() => {
        if (selectedPointId) {
            const point = points.find((p) => p.id === selectedPointId);

            setSelectedPoint(point || null);

            if (point) {
                setCenter({lat: point.lat, lng: point.lng});
                setSelectedPointObjects(point.objects);
            }
        } else {
            setSelectedPoint(null);
        }
    }, [selectedPointId, points]);

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const clickedPoint: IPoint = {
                id: '',
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                description: `point #${points.length+1}`,
                objects: [],
            };

            const existingPoint = points.find(
                (point) => point.lat === clickedPoint.lat && point.lng === clickedPoint.lng
            );

            if (existingPoint) {
                selectPoint(existingPoint.id);
            } else {
                const newPoint: IPoint = {
                    ...clickedPoint,
                    id: nanoid(),
                };

                setSelectedPoint(newPoint);
                clickMap(newPoint);

                setSelectedPointObjects([]);
            }
        }
    };

    const handleMarkerClick = (point: IPoint) => {
        clickMarker(point);
        selectPoint(point.id);

        setSelectedPointObjects(point.objects);
        setSelectedObjectName(null);
    };

    const handlePointDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedPoint) {
            const updatedPoint: IPoint = {
                ...selectedPoint,
                description: event.target.value,
            };

            setSelectedPoint(updatedPoint);
            editPoint(updatedPoint);
        }
    };

    const handleDeletePoint = () => {
        if (selectedPoint) {
            deletePoint(selectedPoint.id);

            setSelectedPoint(null);
        }
    };

    const handleObjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewObjectName(event.target.value);
    };

    const handleAddObject = () => {
        if (selectedPoint && newObjectName.trim() !== '') {
            addObject(selectedPoint.id, newObjectName);
            setNewObjectName('');

            setSelectedPointObjects([...selectedPointObjects, newObjectName]);
        }
    };

    const handleObjectDelete = (objectName: string) => {
        if (selectedPoint) {
            const updatedObjects = selectedPoint.objects.filter((object: string) => object !== objectName);

            const updatedPoint: IPoint = {
                ...selectedPoint,
                objects: updatedObjects,
            };

            setSelectedPoint(updatedPoint);
            editPoint(updatedPoint);

            deleteObject(selectedPoint.id, objectName);
            setSelectedObjectName(null);
        }
    };

    const handleObjectUpdate = (objectName: string) => {
        if (selectedPoint) {
            const updatedObjects = selectedPoint.objects.map((object: string) => {
                if (object === selectedObjectName) {
                    return objectName;
                }

                return object;
            });

            const updatedPoint: IPoint = {...selectedPoint, objects: updatedObjects};

            setSelectedPoint(updatedPoint);
            editPoint(updatedPoint);

            updateObject(selectedPoint.id, objectName);
            setSelectedObjectName(null);
        }
    };

    const handleSelectedObjectName = (objectName: string | null) => {
        setSelectedObjectName(objectName);
    }

    if (!isLoaded) {
        return (
            <div className="d-flex align-items-center justify-content-center mt-5">
                <div className="spinner-border spinner" role="status"></div>
            </div>
        );
    }

    return (
        <div className="d-flex row col-12">
            <div className="col-lg-6 col-12 mx-3">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                    onClick={handleMapClick}
                >
                    {points.map((point) => (
                        <Marker
                            key={point.id}
                            position={{lat: point.lat, lng: point.lng}}
                            onClick={() => handleMarkerClick(point)}
                        />
                    ))}
                </GoogleMap>
            </div>

            {selectedPoint && (
                <div className="d-flex flex-column col-lg-5 col-12">
                    <div className="input-group mb-5">
                        <BaseInput
                            baseValue={selectedPoint.description}
                            baseChange={handlePointDescriptionChange}
                            basePlaceholder="Enter a description"
                        />
                        <div className="input-group-prepend">
                            <BaseButton
                                text="Delete Point"
                                baseClick={handleDeletePoint}
                            />
                        </div>
                    </div>

                    <div className="mx-4 mb-2">
                        {selectedPointObjects.length ? (
                            <ObjectList
                                objects={selectedPointObjects}
                                onDeleteObject={handleObjectDelete}
                                onUpdateObject={handleObjectUpdate}
                                selectObjectName={handleSelectedObjectName}
                                selectedObjectName={selectedObjectName}
                                onSelectObject={setSelectedObjectName}
                            />
                        ) : (
                            <p>Оbjects have not been added</p>
                        )}
                    </div>

                    <div className="input-group">
                        <BaseInput
                            baseValue={newObjectName}
                            baseChange={handleObjectNameChange}
                            basePlaceholder="Enter an object name"
                        />
                        <div className="input-group-append">
                            <BaseButton
                                text="Add Object"
                                baseClick={handleAddObject}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
