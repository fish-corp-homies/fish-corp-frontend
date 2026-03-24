// app/not-found.tsx
export default function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <video
                src="/out.mp4" // place file in /public/404-video.mp4
                autoPlay
                loop
                muted
                playsInline
                style={{ maxWidth: '100%', marginTop: '20px' }}
            />
        </div>
    );
}