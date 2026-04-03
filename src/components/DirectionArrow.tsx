import { compassLabel } from '@/lib/direction';

interface DirectionArrowProps {
    degrees: number;
    /** Pass true for "from" fields (wind_from_direction, wave_from_direction).
     *  Flips the arrow and label 180° so they show where the wind/wave is going. */
    from?: boolean;
}

export default function DirectionArrow({ degrees, from = false }: DirectionArrowProps) {
    const display = from ? (degrees + 180) % 360 : degrees;
    return (
        <span style={{ display: 'inline-block', transform: `rotate(${display}deg)`, lineHeight: 1, fontSize: '1.5rem' }}>↑</span>
    );
}
