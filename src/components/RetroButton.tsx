import { useState } from 'react';

interface RetroButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    padding?: string;
    minWidth?: string;
}

export default function RetroButton({ children, onClick, padding = "px-4 py-1", minWidth = "min-w-[40px]" }: RetroButtonProps) {
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
                <div className={`${innerClass} ${padding}`}>
                    <div className={`${textShift} ${minWidth} flex items-center justify-center`}>
                        {children}
                    </div>
                </div>
            </div>
        </button>
    );
}
