import React, {ChangeEventHandler, FocusEventHandler, HTMLInputTypeAttribute} from 'react';

interface BaseInputProps {
    baseChange?: ChangeEventHandler | undefined;
    baseFocus?: FocusEventHandler | undefined;
    basePlaceholder?: string | null;
    baseValue?: string | ReadonlyArray<string> | number | undefined;
    type?: HTMLInputTypeAttribute | undefined;
}

export default function BaseInput({type, baseValue, baseChange, basePlaceholder, baseFocus}: BaseInputProps) {
    return (
        <input
            type={type ? type : 'text'}
            onFocus={baseFocus}
            value={baseValue}
            onChange={baseChange}
            className="form-control"
            placeholder={basePlaceholder ? basePlaceholder : "Enter value"}
        />
    );
}
