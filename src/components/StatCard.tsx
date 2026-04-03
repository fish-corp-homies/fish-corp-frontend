interface StatCardProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

export default function StatCard({ label, value, className }: StatCardProps) {
    return (
        <div className={`outer-border ${className ?? ''}`}>
            <div className="inner-border px-3 py-2">
                <div className="text-xs text-gray-900">{label}</div>
                <div className="font-bold text-lg">{value}</div>
            </div>
        </div>
    );
}
