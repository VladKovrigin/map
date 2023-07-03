import React, {MouseEventHandler} from 'react';

interface BaseButtonProps {
    baseClick?: MouseEventHandler | undefined;
    text: string;
    classNames?: string | null;
}

export default function BaseButton({text, baseClick, classNames}: BaseButtonProps) {
    return (
        <button
            className={"btn btn-outline-secondary" + (classNames ? classNames : '')}
            onClick={baseClick}
        >
            {text}
        </button>
    );
}
