import { useEffect, useState, useRef, useCallback, use } from "react";
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
import OpenLinkWindow from "../../components/windows/openLink";
import DesktopConfigWindow from "../../components/windows/desktopConfig";
import ImageViewerWindow from "../../components/windows/imageViewer";
import SocialWindow from "../../components/windows/social";
import { FileData } from "../../types/file";
import { getFilesFromDesktopService, updateFilePositionService } from "../../services/fileServices";
import { useAppContext } from "../../context/AppContext";
import { useFileContext } from "../../context/FileContext";
import ContextMenu from "../../components/contextMenu";
import DeleteFileWindow from "../../components/windows/deleteFile";


export default function DashboardPage() {
    const { rootFiles, changeRootFiles, allFiles } = useFileContext();
    const { changeNextIconPosition, blackScreen } = useAppContext();
    const { t } = useTranslation();
    const { root } = useRootContext();
    const { user, hasDesktops, setHasDesktops, currentDesktop, bgColors } = useUser();
    const { newFile, listdt, openLink, contextMenu, dtConfig, deleteFile } = useWindowContext();
    const [start, setStart] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0)
    const [saving, setSaving] = useState<boolean>(false)
    const filesMap = useRef<Map<string, { id: string; xPos: number; yPos: number }>>(new Map());
    const [isDraggin, setIsDraggin] = useState<boolean>(false);
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [lastDraggedId, setLastDraggedId] = useState<string>('');
    const [filesBeforeReq, setFilesBeforeReq] = useState<FileData[]>([])
    const originalFilesRef = useRef<FileData[]>([]);

    useEffect(() => {
        document.documentElement.style.setProperty('--color-darker', bgColors.darker);
        document.documentElement.style.setProperty('--color-dark', bgColors.dark);
        document.documentElement.style.setProperty('--color-regular', bgColors.regular);
        document.documentElement.style.setProperty('--color-light', bgColors.light);
        document.documentElement.style.setProperty('--color-lighter', bgColors.lighter);
        document.documentElement.style.setProperty('--color-whity', bgColors.whity);
    }, [bgColors]);

    useEffect(() => {
        if (isDraggin || filesMap.current.size === 0) {
            setTimer(20);
            return;
        }


        if (timer === 0) {
            const saveChanges = async () => {

                const movedFiles = Array.from(filesMap.current.values());

                const hasChanged = Array.from(filesMap.current.values()).some(movedFile => {
                    const original = originalFilesRef.current.find(f => f.id === movedFile.id);
                    return original && (original.xPos !== movedFile.xPos || original.yPos !== movedFile.yPos);
                });

                if (!hasChanged) {
                    filesMap.current.clear();
                    return;
                }

                try {
                    await updateFilePositionService(movedFiles);
                    originalFilesRef.current = rootFiles;
                    filesMap.current.clear();
                } catch (err) {
                    console.error("Erro ao salvar", err);
                } finally {
                    setSaving(true);
                    setTimeout(() => setSaving(false), 2000);
                }
            };

            saveChanges();
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => Math.max(prev - 1, 0));
            console.log(timer)
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, isDraggin]);


    const findNextAvailablePosition = (icons: FileData[], containerWidth: number): { x: number; y: number } | null => {
        const GRID_SIZE = 100;
        const occupiedPositions = new Set(
            icons.map(icon => `${icon.xPos},${icon.yPos}`)
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


    useEffect(() => {
        if (!hasDesktops) return;
        setTimeout(() => { setStart(true) }, 500);
    }, [hasDesktops]);


    useEffect(() => {
        const containerWidth = desktopRef.current?.clientWidth || window.innerWidth;

        const nextPosition = findNextAvailablePosition(rootFiles, containerWidth);

        if (nextPosition) {
            changeNextIconPosition(nextPosition);
        };

        setTimer(20)

    }, [rootFiles]);

    useEffect(() => {
        if (!user || !currentDesktop?.id) return;

        setStart(false)
        setStart(true)

        const getAllFiles = async () => {
            try {
                const files = await getFilesFromDesktopService(currentDesktop.id)
                changeRootFiles(files)
                originalFilesRef.current = files;

            } catch (err) {
                alert(err)
            }
        }

        getAllFiles()

    }, [currentDesktop?.id, user?.id]);

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
    }, [rootFiles, checkOverflow]);

    const handleContextClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {

        if (e.button != 2) {
            contextMenu.setIsVisible(false)
            contextMenu.setSelectedIconId('')
            return;
        };

        contextMenu.setPosition({
            x: e.clientX, y: e.clientY
        })
        contextMenu.setIsVisible(true)

        const elementIsIcon = (e.target as HTMLElement).closest('[data-id]') as HTMLElement;



        if (elementIsIcon) {
            const icon = allFiles.filter((icon) => icon.id === elementIsIcon.dataset.id)[0]

            contextMenu.setSelectedIconId(elementIsIcon.dataset.id as string)
            contextMenu.setFunctions([
                {
                    label: 'Excluir Arquivo',
                    action: () => {
                        deleteFile.setFile(icon)
                        deleteFile.openWindow()
                        contextMenu.setIsVisible(false)
                    }
                },
            ])
        } else {
            contextMenu.setSelectedIconId('')
            contextMenu.setFunctions([
                {
                    label: 'Criar Arquivo',
                    action: () => {
                        newFile.setFile(null)
                        newFile.openWindow()
                        contextMenu.setIsVisible(false)
                    }
                },
                {
                    label: 'Alterar Desktop',
                    action: () => {
                        dtConfig.setDesktop(currentDesktop)
                        dtConfig.openWindow()
                        contextMenu.setIsVisible(false)
                    }
                }
            ])
        };


    }, [currentDesktop, deleteFile])



    const activeElementRef = useRef<HTMLElement | null>(null);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const desktopRect = useRef<DOMRect | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {

        if (e.button === 2) {
            handleContextClick(e);
            return;
        }

        contextMenu.setSelectedIconId('')

        const element = (e.target as HTMLElement).closest('[data-id]') as HTMLElement;
        if (!element || !desktopRef.current) {
            contextMenu.setIsVisible(false);
            return;
        }

        desktopRect.current = desktopRef.current.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        activeElementRef.current = element;
        setLastDraggedId(element.dataset.id || '');
        setIsDraggin(true);
        contextMenu.setIsVisible(false);
    }, [handleContextClick, contextMenu]);


    const moverMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!activeElementRef.current || !isDraggin || !desktopRect.current || !desktopRef.current) return;
        setIsMoving(true)

        const x = e.clientX - desktopRect.current.left + desktopRef.current.scrollLeft - dragOffset.current.x;
        const y = e.clientY - desktopRect.current.top + desktopRef.current.scrollTop - dragOffset.current.y;


        activeElementRef.current.style.left = `${x}px`;
        activeElementRef.current.style.top = `${y}px`;
    }, [isDraggin]);

    const soltarMouse = useCallback(() => {
        if (!isDraggin || !activeElementRef.current) return;

        const draggedIconId = lastDraggedId;
        const GRID_SIZE = 100;

        const rawX = parseInt(activeElementRef.current.style.left);
        const rawY = parseInt(activeElementRef.current.style.top);

        let currentX = Math.round(rawX / GRID_SIZE) * GRID_SIZE;
        let currentY = Math.round(rawY / GRID_SIZE) * GRID_SIZE;

        if (currentX < 0) currentX = 0
        if (currentY < 0) currentY = 0

        activeElementRef.current.style.left = `${currentX + 10}px`;
        activeElementRef.current.style.top = `${currentY + 10}px`;

        const draggedIconOriginal = rootFiles.find(i => i.id === draggedIconId);
        if (!draggedIconOriginal) return;

        const existingIcon = rootFiles.find(icon =>
            icon.id !== draggedIconId &&
            currentX === icon.xPos &&
            currentY === icon.yPos
        );

        if (existingIcon) {
            filesMap.current.set(draggedIconId, { id: draggedIconId, xPos: existingIcon.xPos, yPos: existingIcon.yPos });
            filesMap.current.set(existingIcon.id, { id: existingIcon.id, xPos: draggedIconOriginal.xPos, yPos: draggedIconOriginal.yPos });

            changeRootFiles(rootFiles.map(icon => {
                if (icon.id === draggedIconId) return { ...icon, xPos: existingIcon.xPos, yPos: existingIcon.yPos };
                if (icon.id === existingIcon.id) return { ...icon, xPos: draggedIconOriginal.xPos, yPos: draggedIconOriginal.yPos };
                return icon;
            }));
        } else {
            filesMap.current.set(draggedIconId, { id: draggedIconId, xPos: currentX, yPos: currentY });

            changeRootFiles(rootFiles.map(icon =>
                icon.id === draggedIconId ? { ...icon, xPos: currentX, yPos: currentY } : icon
            ));
        }

        setIsDraggin(false);
        setIsMoving(false);
        setLastDraggedId('');
        activeElementRef.current = null;
    }, [isDraggin, lastDraggedId, rootFiles, changeRootFiles]);

    useEffect(() => {
        const disableRightClick = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', disableRightClick);

        return () => document.removeEventListener('contextmenu', disableRightClick);
    }, []);




    return (
        <>
            <div className={`${blackScreen ? '' : 'opacity-0 pointer-none select-none'} transition-opacity duration-600 pointer-events-none z-201 absolute bg-black w-full h-screen`} />

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
                style={{ backgroundImage: `url(${currentDesktop?.backgroundImage})` }}
            ></div>)}
            {hasDesktops ? '' : (<PersonalDesktopWindow onFinish={(bool) => setHasDesktops(bool)} />)}


            <ConfigWindow />
            <NewFileWindow />
            <ProfileWindow />
            <FileWindow />
            <ListDesktopsWindow />
            <NewDesktopWindow />
            <DesktopConfigWindow />
            <ImageViewerWindow />
            <SocialWindow />
            <DeleteFileWindow />

            <OpenLinkWindow url={openLink.url as string} />
            <div className={`${start ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 flex flex-col w-full h-screen overflow-hidden text-white relative select-none`}>
                <ContextMenu />
                <div className="flex flex-row flex-wrap justify-between items-center w-full gap-3 p-4">
                    <div className=" w-full max-w-50">
                        <button onClick={() => {
                            newFile.setFile(null)
                            newFile.openWindow()
                        }}
                            className="flex flex-row items-center justify-start gap-2 p-1 px-3 cursor-pointer rounded-md bg-black/40 backdrop-blur-md hover:bg-black/65 border-[1px] 
                    border-transparent hover:text-(--color-lighter) hover:border-(--color-lighter) transition-all select-none">
                            <CirclePlus />
                            <p className="text-lg">{t("dashboard.create")}</p>
                        </button>
                    </div>
                    <SearchBar />

                    {/* VERSÃO LANÇAMENTO */}

                    {/* <div onClick={listdt.openWindow} className="flex flex-row items-center justify-between gap-2 p-1 px-3 cursor-pointer rounded-md bg-black/40 backdrop-blur-md hover:bg-black/65 border-[1px] 
                    border-white hover:text-(--color-lighter) hover:border-(--color-lighter) transition-all w-full max-w-50 select-none">
                            <p className="text-lg truncate">{currentDesktop?.name} ({currentDesktop?.type})</p>
                            <GripVertical />
                        </div> */}

                    <div onClick={listdt.openWindow} className="flex flex-row items-center justify-between gap-2 p-1 px-3 cursor-pointer rounded-md bg-black/40 backdrop-blur-md hover:bg-black/65 border-[1px] 
                    border-white hover:text-(--color-lighter) hover:border-(--color-lighter) transition-all w-full max-w-50 select-none">
                        <p className="text-lg truncate">{currentDesktop?.name}</p>
                        <GripVertical />
                    </div>
                </div>

                <ArrowLeftToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollLeft = 0
                    }
                } className={`${contentToLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-(--color-lighter) cursor-pointer transition-all z-20 w-15 h-15 p-3 
                        text-(--color-lighter) rounded-full bg-black/30 backdrop-blur-md fixed left-3 top-[50%] translate-y-[-100%]`} />
                <ArrowUpToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollTop = 0
                    }
                } className={`${contentToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-(--color-lighter) cursor-pointer transition-all z-20 w-15 h-15 p-3 
                        text-(--color-lighter) rounded-full bg-black/30 backdrop-blur-md fixed top-15 left-[50%] translate-x-[-50%]`} />
                <ArrowRightToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollLeft = desktopRef.current.scrollWidth - desktopRef.current.clientWidth
                    }
                } className={`${contentToRight ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-(--color-lighter) cursor-pointer transition-all z-20 w-15 h-15 p-3 
                        text-(--color-lighter) rounded-full bg-black/30 backdrop-blur-md fixed right-3 top-[50%] translate-y-[-100%]`} />
                <ArrowDownToLine onClick={
                    () => {
                        if (!desktopRef.current) return;
                        desktopRef.current.scrollTop = desktopRef.current.scrollHeight - desktopRef.current.clientHeight
                    }
                } className={`${contentToBottom ? 'opacity-100' : 'opacity-0 pointer-events-none'} border-transparent border-[2px] hover:border-(--color-lighter) cursor-pointer transition-all z-20 w-15 h-15 p-3 
                        text-(--color-lighter) rounded-full bg-black/30 backdrop-blur-md fixed bottom-14 left-[50%] translate-x-[-50%]`} />

                <div className={`${saving ? 'opacity-100 z-42' : 'opacity-0 z-0'} select-none pointer-none: p-2 px-3 rounded-sm backdrop-blur-sm bg-black/20 flex flex-row gap-2 absolute 
                top-20 right-5 justify-center items-center transition-opacity duration-300`}>
                    <img src="public/assets/images/changes.png" className="w-8" />
                    <p className="text-[17px]">Posições atualizadas</p>
                </div>

                <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={moverMouse}
                    onMouseUp={soltarMouse}
                    onMouseLeave={soltarMouse}
                    ref={desktopRef}
                    className={`desktop-area flex-1 w-full relative mb-10 p-4 overflow-scroll select-none`}>

                    {rootFiles.map((icon, index) => (
                        <DraggableIcon
                            index={index}
                            key={icon.id}
                            icon={icon}
                            beingDragged={lastDraggedId === icon.id && isMoving}
                            position={{ x: icon.xPos, y: icon.yPos }}
                        />
                    ))}
                </div>

                <TaskBar />
            </div>
        </>
    );
}

