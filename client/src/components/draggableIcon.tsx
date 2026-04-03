import { useRef } from 'react';
// import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Icon from './icon';
import { FileData } from '../types/file';


type DraggableIconProps = {
  index: number,
  icon: FileData;
  beingDragged: boolean;
  position: { x: number; y: number };
  dragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export function DraggableIcon({ index, icon, beingDragged, position, dragStart }: DraggableIconProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className='animate-scale origin-center select-none'
      ref={elementRef}
      data-id={icon.id}
      onMouseDown={dragStart}
      style={{
        animationDelay: `${index * 40}ms`,
        transform: "scale(0)",
        opacity: '0',
        position: "absolute",
        top: position.y,
        left: position.x,
        transition: beingDragged ? "none" : "top 0.2s ease-out, left 0.2s ease-out",
        zIndex: beingDragged ? 100 : 1,
        willChange: "top, left",
      }}
    >
      <div className={`w-24 h-24 flex flex-row justify-center`}>
        <Icon icon={icon} beingDragged={beingDragged} />
      </div>
    </div>
  );
}