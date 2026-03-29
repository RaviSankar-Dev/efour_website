import React from 'react';


const OptimizedImage = ({ src, alt, className, width, height, priority = false }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const imgRef = React.useRef(null);

    // Check if image is already cached/loaded on mount
    React.useEffect(() => {
        if (imgRef.current?.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    // Helper to optimize Unsplash URLs - simplified for performance
    const getOptimizedSrc = (url) => {
        if (!url) return '';
        if (url.includes('images.unsplash.com') && !url.includes('auto=format')) {
            return `${url}${url.includes('?') ? '&' : '?'}auto=format&q=75`;
        }
        return url;
    };

    const optimizedSrc = getOptimizedSrc(src);

    return (
        <div className={`relative overflow-hidden bg-gray-100/5 ${className}`} style={{ width, height }}>
            {/* Show placeholder/pulse only if not loaded and not priority */}
            {!isLoaded && !priority && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse" />
            )}
            <img
                ref={imgRef}
                src={optimizedSrc}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                loading={priority ? "eager" : "auto"}
                decoding={priority ? "sync" : "async"}
                fetchpriority={priority ? "high" : "auto"}
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded || priority ? 'opacity-100' : 'opacity-0'} ${className}`}
                width={width}
                height={height}
            />
        </div>
    );
};

export default OptimizedImage;

