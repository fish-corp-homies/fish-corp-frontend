'use client';

import { useState } from 'react';

interface CollapsibleTableProps {
    children: React.ReactNode;
    label?: string;
}

export default function CollapsibleTable({ children, label = 'Hourly Data' }: CollapsibleTableProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="px-4 pb-4">
            <div
                className={`${show ? 'pressed-outer-border' : 'outer-border'} cursor-pointer select-none w-fit mb-3`}
                onClick={() => setShow(prev => !prev)}
            >
                <div className={`${show ? 'pressed-inner-border' : 'inner-border'} px-3 py-1 text-xs font-bold`}>
                    {show ? `Hide ${label}` : `Show ${label}`}
                </div>
            </div>
            {show && (
                <div className="overflow-x-auto">
                    {children}
                </div>
            )}
        </div>
    );
}
