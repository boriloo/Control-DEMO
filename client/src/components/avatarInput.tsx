import { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Pencil } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { type Crop } from 'react-image-crop';
import { useUser } from '../context/AuthContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type AvatarImageInputProps = {
    currentImageUrl?: string;
    onFileSelected: (file: File) => void;
};

export function AvatarImageInput({ onFileSelected, currentImageUrl }: AvatarImageInputProps) {
    const { user } = useUser();
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const [loading, setLoading] = useState<boolean>(false)
    const [originalImage, setOriginalImage] = useState<string | null>(null); // Nova state para imagem original
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10,
    });
    const [isCropping, setIsCropping] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const url = URL.createObjectURL(file);
            setOriginalImage(url); // Guarda a imagem original
            setPreview(url); // Preview inicial é a imagem original
            setIsCropping(true);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/jpeg': [], 'image/png': [] },
        multiple: false,
        noDrag: true,
    });

    // Cleanup de URLs
    useEffect(() => {
        return () => {
            if (originalImage) URL.revokeObjectURL(originalImage);
            if (preview && preview !== currentImageUrl) URL.revokeObjectURL(preview);
        };
    }, [originalImage, preview, currentImageUrl]);

    // Corrigindo a função onImageLoaded para a nova API do react-image-crop
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        imgRef.current = e.currentTarget;

        // Define um crop centralizado baseado na menor dimensão
        const cropSize = Math.min(width, height) * 0.8;
        const x = (width - cropSize) / 2;
        const y = (height - cropSize) / 2;

        setCrop({
            unit: 'px',
            width: cropSize,
            height: cropSize,
            x: x,
            y: y,
        });

        return false;
    };

    const handleCropChange = (c: Crop) => {
        setCrop(c);
    };

    const getCroppedImage = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        let pixelCrop;
        if (crop.unit === '%') {
            pixelCrop = {
                x: (crop.x / 100) * image.naturalWidth,
                y: (crop.y / 100) * image.naturalHeight,
                width: (crop.width / 100) * image.naturalWidth,
                height: (crop.height / 100) * image.naturalHeight,
            };
        } else {
            pixelCrop = {
                x: crop.x * scaleX,
                y: crop.y * scaleY,
                width: crop.width * scaleX,
                height: crop.height * scaleY,
            };
        }

        // Define o tamanho do canvas (imagem final)
        const outputSize = 300; // Tamanho fixo para o avatar
        canvas.width = outputSize;
        canvas.height = outputSize;

        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Limpa o canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outputSize, outputSize);

            // Desenha a imagem cortada redimensionada
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                outputSize,
                outputSize
            );
        }

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas to Blob conversion failed'));
                }
            }, 'image/jpeg', 0.9); // JPEG com qualidade 90%
        });
    };

    const handleConfirmCrop = async () => {
        if (imgRef.current && crop.width && crop.height) {
            try {
                setLoading(true)
                const croppedBlob = await getCroppedImage(imgRef.current, crop);

                if (preview && preview !== currentImageUrl && preview !== originalImage) {
                    URL.revokeObjectURL(preview);
                }

                const croppedUrl = URL.createObjectURL(croppedBlob);
                setPreview(croppedUrl);

                const croppedFile = new File([croppedBlob], 'avatar.jpg', {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });

                onFileSelected(croppedFile);
                setIsCropping(false);
            } catch (error) {
                console.error('Erro ao processar crop:', error);
                alert('Erro ao processar a imagem. Tente novamente.');
            } finally {
                setLoading(false)
            }
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        if (originalImage) {
            URL.revokeObjectURL(originalImage);
            setOriginalImage(null);
        }
        setPreview(currentImageUrl || null);
    };

    return (
        <>
            <div
                {...getRootProps()}
                className="relative rounded-full overflow-hidden cursor-pointer group bg-zinc-700 transition w-full max-w-[120px] h-[120px] hover:bg-zinc-800"
            >
                <input {...getInputProps()} />

                <div
                    className="w-full h-[120px] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${preview || user?.profileImage || '/assets/images/profile.png'})`,
                    }}
                />
                <div className="absolute top-0 left-0 z-10 p-2 w-full h-full flex justify-center items-center font-medium text-lg transition-all opacity-0 bg-black/60 group-hover:opacity-100 rounded-full">
                    <Pencil size={35} />
                </div>
            </div>

            {isCropping && originalImage && (
                <div className="fixed inset-0 z-50 bg-black/90 w-full flex flex-col ">
                    <div className="min-h-screen flex flex-col items-center p-4 gap-6 overflow-y-auto">
                        <h2 className="text-white text-xl text-center flex-shrink-0">Ajuste sua foto</h2>

                        <div className="w-full max-w-[800px] p-2 flex items-center justify-center relative flex-shrink-0">
                            <ReactCrop
                                crop={crop}
                                onChange={handleCropChange}
                                aspect={1}
                                className="max-w-full max-h-[400px]"
                            >
                                <img
                                    ref={imgRef}
                                    src={originalImage}
                                    alt="Crop preview"
                                    className="max-w-full max-h-[400px] object-contain"
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        </div>
                        <div className="flex gap-4 flex-shrink-0 pb-18">
                            <button
                                disabled={loading}
                                onClick={handleCancelCrop}
                                className="px-6 py-2 border-1 border-zinc-300 text-zinc-300 cursor-pointer rounded-lg hover:bg-zinc-950 hover:border-red-500 hover:text-red-500 transition"
                            >
                                Cancelar
                            </button>
                            {loading ? (
                                <button
                                    onClick={handleConfirmCrop}
                                    className="px-6 py-2 border-1 border-zinc-300 text-zinc-300 cursor-pointer rounded-lg hover:border-blue-500 hover:text-white hover:bg-blue-500 transition"
                                    disabled={!crop.width || !crop.height}
                                >
                                    <DotLottieReact
                                        src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                                        className="w-15 p-0"
                                        loop
                                        autoplay
                                    />
                                </button>
                            ) : (
                                <button
                                    onClick={handleConfirmCrop}
                                    className="px-6 py-2 border-1 border-zinc-300 text-zinc-300 cursor-pointer rounded-lg hover:border-blue-500 hover:text-white hover:bg-blue-500 transition"
                                    disabled={!crop.width || !crop.height}
                                >
                                    Confirmar
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}