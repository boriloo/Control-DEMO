import { useState, useEffect } from 'react';

type SmartImageProps = {
    src: string;
    fallbackSrc?: string; // opcional agora
    className?: string;
    onValidation?: (isValid: boolean) => void; // ✅ para retornar booleano
};

export function SmartImage({ src, fallbackSrc, className, onValidation }: SmartImageProps) {
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
        setImageSrc(src);
    }, [src]);

    const handleLoad = () => {
        onValidation?.(true); // ✅ imagem carregou -> link válido
    };

    const handleError = () => {
        onValidation?.(false); // ❌ erro -> link inválido
        if (fallbackSrc) setImageSrc(fallbackSrc);
    };

    return (
        <img
            src={imageSrc}
            onLoad={handleLoad}
            onError={handleError}
            className={className ?? 'pointer-events-none select-none w-full h-full object-contain'}
        />
    );
}
