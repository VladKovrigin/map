import React from 'react';
import {IPoint} from '../interfaces/IPoint';

interface PointListProps {
    points: IPoint[];
    onPointSelect: (pointId: string | null) => void;
    selectedPointId: string | null;
}

export default function PointList({points, onPointSelect, selectedPointId}: PointListProps) {
    const selectPoint = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onPointSelect(event.target.value.length ? event.target.value : null);
    };

    return (
        <div className="col-lg-3 col-12 mb-3 mx-3 mt-5">
            <select
                className="form-select"
                value={selectedPointId || ''}
                onChange={selectPoint}
            >
                <option value="">
                    Select a point
                </option>
                {points.map((point) => (
                    <option value={point.id} key={point.id}>
                        {point.description}
                    </option>
                ))}
            </select>
        </div>
    );
}
