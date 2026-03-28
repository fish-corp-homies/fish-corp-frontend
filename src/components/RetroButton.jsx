import { useState } from 'react';

export default function RetroButton({ children, onClick, padding = "px-4 py-1", minWidth = "min-w-[40px]" }) {
    const [isPressed, setIsPressed] = useState(false);

    const outerClass = isPressed ? "pressed-outer-border" : "outer-border";
    const innerClass = isPressed ? "pressed-inner-border" : "inner-border";
    const textShift = isPressed ? "translate-x-[1px] translate-y-[1px]" : "";

    return (
        <button
            onClick={onClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className="outline-none select-none block w-fit bg-transparent border-none p-0 cursor-pointer"
        >
            <div className={outerClass}>
                {/* We use the 'padding' prop here */}
                <div className={`${innerClass} ${padding}`}>
                    {/* We use the 'minWidth' prop here */}
                    <div className={`${textShift} ${minWidth} flex items-center justify-center`}>
                        {children}
                    </div>
                </div>
            </div>
        </button>
    );
}