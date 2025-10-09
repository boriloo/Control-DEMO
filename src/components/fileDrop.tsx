import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, FileImage, X } from 'lucide-react';

type ClickableImageInputProps = {
    onFileSelected: (file: File) => void;
};

export function FileDropzone({ onFileSelected }: ClickableImageInputProps) {
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (acceptedFiles.length > 0) {
            setPreviewFile(acceptedFiles[0]);
            onFileSelected(acceptedFiles[0]);
        }
        if (fileRejections.length > 0) {
            alert(`O ficheiro ${fileRejections[0].file.name} não é um tipo de imagem válido.`);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/gif': []
        },
        multiple: false
    });

    const removeFile = () => {
        setPreviewFile(null);
    };

    if (previewFile) {
        return (
            <div className="w-full h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2">Imagem Selecionada</h3>
                <div className="flex-1 overflow-y-auto">
                    <div key={previewFile.name} className="flex items-center justify-start gap-1 pr-11 bg-zinc-700 p-2 rounded-md relative overflow-hidden">

                        <FileImage size={25} className="text-blue-400" />
                        <span className="text-sm truncate">{previewFile.name}</span>

                        <button onClick={removeFile} className='absolute right-0 w-10 flex justify-center items-center h-full text-zinc-400 cursor-pointer transition-all hover:bg-red-500 hover:text-white'>
                            <X />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`w-full h-full p-8 border-2 border-dashed rounded-lg flex flex-col justify-center items-center text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-500 hover:border-zinc-400 hover:bg-zinc-800'}`}
        >
            <input {...getInputProps()} />
            <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragActive ? 'text-blue-400' : 'text-zinc-400'}`} />
            {isDragActive ? (
                <p className="text-xl font-semibold text-blue-300">Solte a imagem aqui...</p>
            ) : (
                <>
                    <p className="text-xl font-semibold">Arraste e solte a sua imagem aqui</p>
                    <p className="text-zinc-400 mt-1">ou clique para selecionar um ficheiro</p>
                    <p className="text-xs text-zinc-500 mt-4">Apenas imagens (PNG, JPG, etc.) são permitidas</p>
                </>
            )}
        </div>
    );
}
