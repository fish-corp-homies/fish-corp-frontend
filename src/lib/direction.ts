const LABELS_16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

export function compassLabel(degrees: number): string {
    const index = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
    return LABELS_16[index];
}

// String-only fallback for chart tooltip formatters
export function degreesToCompass(degrees: number): string {
    return compassLabel(degrees);
}
