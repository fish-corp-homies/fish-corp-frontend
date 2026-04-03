interface SectionPanelProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    compact?: boolean;
}

export default function SectionPanel({ title, children, className, compact }: SectionPanelProps) {
    return (
        <div className={`outer-border ${className ?? ''}`}>
            <div className="inner-border p-0 overflow-hidden">
                <div className={`bg-blue-800 text-white font-bold px-2 py-1 select-none ${compact ? 'text-xs' : 'text-sm'}`}>
                    {title}
                </div>
                {children}
            </div>
        </div>
    );
}
