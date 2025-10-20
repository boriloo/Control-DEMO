import { useEffect, useState, useRef, useCallback } from "react";
import { DraggableData, DraggableEvent } from 'react-draggable';
import { ArrowDownToLine, ArrowLeftToLine, ArrowRightToLine, ArrowUpToLine, CirclePlus, GripVertical } from "lucide-react";
import { DraggableIcon } from "../../components/draggableIcon";
import { useDraggableScroll } from "../../components/dragScroll";
import ProfileWindow from "../../components/windows/profile";
import NewFileWindow from "../../components/windows/newFile";
import FileWindow from "../../components/windows/fileViewer";
import { useUser } from "../../context/AuthContext";
import TaskBar from "../../components/taskbar";
import { useWindowContext } from "../../context/WindowContext";
import { useRootContext } from "../../context/RootContext";
import ConfigWindow from "../../components/windows/config";
import PersonalDesktopWindow from "../../components/windows/personalDesktop";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SearchBar from "../../components/SearchBar";
import ListDesktopsWindow from "../../components/windows/listDesktops";
import NewDesktopWindow from "../../components/windows/newDesktop";
import { useTranslation } from "react-i18next";
import { FullFileData, listenToAllFilesByDesktop, updateFilePosition } from "../../services/file";
import OpenLinkWindow from "../../components/windows/openLink";
import DesktopConfigWindow from "../../components/windows/desktopConfig";
import ImageViewerWindow from "../../components/windows/imageViewer";


const findNextAvailablePosition = (icons: FullFileData[], containerWidth: number): { x: number; y: number } | null => {
    const GRID_SIZE = 100;
    const occupiedPositions = new Set(
        icons.map(icon => `${icon.position.x},${icon.position.y}`)
    );

    for (let y = 0; y > -1; y += GRID_SIZE) {
        for (let x = 0; x < containerWidth - 80; x += GRID_SIZE) {
            const currentPosition = `${x},${y}`;
            if (!occupiedPositions.has(currentPosition)) {
                return { x, y };
            }
        }
    }
    return null;
};

export default function DashboardPage() {
    const { t } = useTranslation();
    const { root } = useRootContext();
    const { user, hasDesktops, setHasDesktops, currentDesktop } = useUser();
    const { newFile, listdt, openLink } = useWindowContext();
    const [start, setStart] = useState<boolean>(false);
    const [desktopFiles, setDesktopFiles] = useState<FullFileData[]>([])
    const [searchFiles, setSearchFiles] = useState<FullFileData[]>([])

    useEffect(() => {
        if (!hasDesktops) return;
        setTimeout(() => { setStart(true) }, 500);
    }, [hasDesktops]);

    useEffect(() => {
        if (!user || !currentDesktop?.id) return;


        const unsubscribeAll = listenToAllFilesByDesktop(
            user.uid as string,
            currentDesktop.id,
            (newFiles) => {
                const filtered = newFiles.filter((file) =>
                    file.parentId === null
                )
                setDesktopFiles(filtered)
                setSearchFiles(newFiles);
            }
        );

        return unsubscribeAll;

    }, [currentDesktop?.id, user?.uid]);

    const desktopRef = useRef<HTMLDivElement>(null);
    const [contentToRight, setContentToRight] = useState<boolean>(false)
    const [contentToBottom, setContentToBottom] = useState<boolean>(false)
    const [contentToLeft, setContentToLeft] = useState<boolean>(false)
    const [contentToTop, setContentToTop] = useState<boolean>(false)

    const checkOverflow = useCallback(() => {
        const desktopEl = desktopRef.current;
        if (!desktopEl) return;
        const hasContentToLeft = desktopEl.scrollLeft > 0;
        const hasContentToTop = desktopEl.scrollTop > 0;

        const isAtHorizontalEnd = Math.abs(desktopEl.scrollWidth - desktopEl.clientWidth - desktopEl.scrollLeft) < 1;
        const isAtVerticalEnd = Math.abs(desktopEl.scrollHeight - desktopEl.clientHeight - desktopEl.scrollTop) < 1;
        const hasHorizontalOverflow = desktopEl.scrollWidth > desktopEl.clientWidth;
        const hasVerticalOverflow = desktopEl.scrollHeight > desktopEl.clientHeight;

        setContentToLeft(hasContentToLeft);
        setContentToTop(hasContentToTop);
        setContentToRight(hasHorizontalOverflow && !isAtHorizontalEnd);
        setContentToBottom(hasVerticalOverflow && !isAtVerticalEnd);
    }, []);

    const initialDragState = useRef<FullFileData[] | null>(null);

    const handleDragStart = () => {
        root.setCanOpenWindow(true);
        initialDragState.current = desktopFiles;
    };

    const handleDrag = (e: DraggableEvent, data: DraggableData, draggedIconId: string) => {
        root.setCanOpenWindow(false);
        if (!initialDragState.current) return;
        const GRID_SIZE = 100;
        const roundToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;
        const currentPosition = { x: roundToGrid(data.x), y: roundToGrid(data.y) };
        const originalIcons = initialDragState.current;
        const draggedIconOriginal = originalIcons.find(i => i.id === draggedIconId);
        if (!draggedIconOriginal) return;

        const targetIcon = originalIcons.find(icon =>
            icon.id !== draggedIconId &&
            currentPosition.x === icon.position.x &&
            currentPosition.y === icon.position.y
        );

        if (targetIcon) {
            setDesktopFiles(originalIcons.map(icon => {
                if (icon.id === draggedIconId) return { ...icon, position: targetIcon.position };
                if (icon.id === targetIcon.id) return { ...icon, position: draggedIconOriginal.position };
                return icon;
            }));
        } else {
            setDesktopFiles(originalIcons.map(icon =>
                icon.id === draggedIconId ? { ...icon, position: currentPosition } : icon
            ));
        }

        checkOverflow();
    };

    const handleDragStop = () => {
        initialDragState.current = null;
        checkOverflow();
        desktopFiles.forEach(async (file) => {
            try {
                await updateFilePosition(file.id, file.position);
            } catch (error) {
                console.error(`Erro ao atualizar a posição do arquivo ${file.id}:`, error);
            }
        });
    };

    useDraggableScroll(desktopRef);

    useEffect(() => {
        const desktopEl = desktopRef.current;
        if (!desktopEl) return;

        desktopEl.addEventListener('scroll', checkOverflow);
        window.addEventListener('resize', checkOverflow);
        checkOverflow();

        return () => {
            desktopEl.removeEventListener('scroll', checkOverflow);
            window.removeEventListener('resize', checkOverflow);
        };
    }, [desktopFiles, checkOverflow]);


    return (
        <>
            <div className="pointer-events-none fixed z-[-3] flex justify-center items-center w-full min-h-screen">
                <DotLottieReact
                    src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                    className="w-20 p-0"
                    loop
                    autoplay
                />
            </div>
            <div className={`${start ? 'opacity-0' : 'opacity-100'} bg-black transtion-all duration-500 pointer-events-none fixed z-50 flex justify-center items-center w-full min-h-screen`}>
                <p className={`control-text text-[50px]`}>Control</p>
            </div>
            {hasDesktops && (<div className={`${start ? 'opacity-100 ' : 'blur-3xl opacity-0'} transition-[opacity,filter] duration-1500 scale-101 flex min-h-screen w-full fixed 
             bg-cover bg-center z-[-2]`}
                style={{ backgroundImage: `url(${localStorage.getItem('background')})` }}></div>)}
            {hasDesktops && (<div className={`${start ? 'opacity-100 ' : 'blur-3xl opacity-0'} transition-[opacity,filter] duration-1500 scale-101 flex min-h-screen w-full fixed 
             bg-cover bg-center z-[-1]`}
                style={{ backgroundImage: `url(${currentDesktop?.background})` }}></div>)}
            {hasDesktops ? '' : (<PersonalDesktopWindow onFinish={(bool) => setHasDesktops(bool)} />)}

            <ConfigWindow />
            <NewFileWindow />
            <ProfileWindow />
            <FileWindow />
            <ListDesktopsWindow />
            <NewDesktopWindow />
            <DesktopConfigWindow />
            <ImageViewerWindow />
            <OpenLinkWindow url={openLink.url as string} />
            <div className={`${start ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 flex flex-col w-full h-screen overflow-hidden text-white`}>
                <div className="flex flex-row flex-wrap justify-between items-center w-full gap-3 p-4">
                    <div className=" w-full max-w-50">
                        <button onClick={() => {
                            newFile.setFile(null)
                            newFile.openWindow()
                        }}
                            className="flex flex-row items-center justify-start gap-2 p-1 px-3 cursor-pointer rounded-md bg-black/40 backdrop-blur-md hover:bg-black/65 border-[1px] 
                border-transparent hover:text-blue-500 hover:border-blue-500 transition-all">
                            <CirclePlus />
                            <p className="text-lg">{t("dashboard.create")}</p>
                        </button>
                    </div>
                    <SearchBar />
                    <div onClick={listdt.openWindow} className="flex flex-row items-center justify-between gap-2 p-1 px-3 cursor-pointer rounded-md bg-black/40 backdrop-blur-md hover:bg-black/65 border-[1px] 
                border-white hover:text-blue-500 hover:border-blue-500 transition-all w-full max-w-50 select-none">
                        <p className="text-lg truncate">{currentDesktop?.name} ({currentDesktop?.type})</p>
                        <GripVertical />
                    </div>
                </div>

                <ArrowLeftToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollLeft = 0
                    }
                } className={`${contentToLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-blue-500 cursor-pointer transition-all z-20 w-15 h-15 p-3 
                    text-blue-500 rounded-full bg-black/30 backdrop-blur-md fixed left-3 top-[50%] translate-y-[-100%]`} />
                <ArrowUpToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollTop = 0
                    }
                } className={`${contentToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-blue-500 cursor-pointer transition-all z-20 w-15 h-15 p-3 
                    text-blue-500 rounded-full bg-black/30 backdrop-blur-md fixed top-15 left-[50%] translate-x-[-50%]`} />
                <ArrowRightToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollLeft = desktopRef.current.scrollWidth - desktopRef.current.clientWidth
                    }
                } className={`${contentToRight ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-blue-500 cursor-pointer transition-all z-20 w-15 h-15 p-3 
                    text-blue-500 rounded-full bg-black/30 backdrop-blur-md fixed right-3 top-[50%] translate-y-[-100%]`} />
                <ArrowDownToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollTop = desktopRef.current.scrollHeight - desktopRef.current.clientHeight
                    }
                } className={`${contentToBottom ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-blue-500 cursor-pointer transition-all z-20 w-15 h-15 p-3 
                    text-blue-500 rounded-full bg-black/30 backdrop-blur-md fixed bottom-14 left-[50%] translate-x-[-50%]`} />

                <div
                    ref={desktopRef} className="desktop-area flex-1 w-full relative mb-10 p-4 overflow-scroll">
                    {desktopFiles.map((icon, index) => (
                        <DraggableIcon
                            key={index}
                            icon={icon}
                            onStart={handleDragStart}
                            onDrag={handleDrag}
                            onStop={handleDragStop}
                        />
                    ))}
                </div>

                <TaskBar />
            </div>
        </>
    );
}

