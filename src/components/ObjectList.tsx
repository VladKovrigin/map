import React from 'react';
import BaseButton from "./BaseButton";
import BaseInput from "./BaseInput";

interface ObjectListProps {
    objects: string[];
    onSelectObject: (objectName: string | null) => void;
    selectedObjectName: string | null;
    selectObjectName: (objectName: string | null) => void;
    onUpdateObject: (objectName: string) => void;
    onDeleteObject: (objectName: string) => void;
}

export default function ObjectList({objects, onDeleteObject, onUpdateObject, selectedObjectName, onSelectObject, selectObjectName}: ObjectListProps) {
    const deleteObject = (object: string) => {
        onDeleteObject(object);
    };

    const updateObject = (event: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateObject(event.target.value);
        onSelectObject(event.target.value === selectedObjectName ? null : event.target.value);
    };

    const handleSelectedObjectName = (event: React.FocusEvent<HTMLInputElement>) => {
        selectObjectName(event.target.value);
    };

    return (
        <ul className="list-unstyled">
            Objects of this location
            {objects.map((object, key) => (
                <li key={key} className="mb-2">
                    <div className="input-group">
                        <BaseInput
                            baseValue={object}
                            baseChange={updateObject}
                            baseFocus={handleSelectedObjectName}
                            basePlaceholder="Enter a description"
                        />
                        <div className="input-group-append">
                            <BaseButton
                                text="Delete"
                                baseClick={() => deleteObject(object)}
                            />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
