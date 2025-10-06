import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUser } from '../context/AuthContext';
import { Upload } from 'lucide-react';
import { useWindowContext } from '../context/WindowContext';

type ClickableImageInputProps = {
    currentImageUrl?: string;
    onFileSelected: (file: File) => void;
};

export function ClickableImageInput({ onFileSelected, currentImageUrl }: ClickableImageInputProps) {
    const { dtConfig } = useWindowContext();
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const [errors, setError] = useState<string | null>()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setError(null)
            const file = acceptedFiles[0];
            setPreview(URL.createObjectURL(file));
            onFileSelected(file);
        }
    }, [onFileSelected]);

    const { getRootProps, getInputProps } = useDropzone({
        maxSize: 10 * 1024 * 1024,
        onDropRejected: () => {
            setError('A imagem é grande demais! O limite é de 10 MB.');
        },
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
        multiple: false,
        noDrag: true,
    });

    useEffect(() => {
        return () => {
            if (preview && !currentImageUrl) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview, currentImageUrl]);

    useEffect(() => {
        setPreview(null)
    }, [dtConfig.desktop?.background])

    return (
        <>
            <div
                {...getRootProps()}
                className={`${preview ? 'min-h-[168px]' : ''} relative rounded-sm overflow-hidden cursor-pointer group 
                    bg-zinc-700 border-2 transition  border-zinc-500 w-full max-w-[300px] hover:bg-zinc-800`}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <>
                        <div
                            className="w-full h-[168px] bg-cover bg-center"
                            style={{ backgroundImage: `url(${preview})` }}
                        />
                        <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center font-medium text-lg transition-all 
      opacity-0 bg-black/50 group-hover:opacity-100 backdrop-blur-sm">
                            Escolher outra imagem
                        </div>
                    </>
                ) : (
                    <>
                        {dtConfig.desktop?.background ? (<>
                            <div
                                className="w-full h-[168px] bg-cover bg-center"
                                style={{ backgroundImage: `url(${dtConfig.desktop?.background} )` }}
                            />
                            <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center font-medium text-lg transition-all 
      opacity-0 bg-black/50 group-hover:opacity-100 backdrop-blur-sm">
                                Escolher outra imagem
                            </div>
                        </>)
                            :
                            (<h1 className="p-2 text-center flex flex-row gap-2 justify-center items-center">
                                Escolher imagem
                                <Upload />
                            </h1>)
                        }

                    </>
                )}
            </div>

            <h1 className={`${errors ? 'bg-red-600/15 p-1 px-2' : 'opacity-0'} mt-2 transition-all self-start rounded-md text-red-500 `}>{errors}</h1>

        </>
    );
}
