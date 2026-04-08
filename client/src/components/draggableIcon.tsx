import { useRef } from 'react';
// import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Icon from './icon';
import { FileData } from '../types/file';


type DraggableIconProps = {
  index: number,
  icon: FileData;
  beingDragged: boolean;
  position: { x: number; y: number };

};

export function DraggableIcon({ index, icon, beingDragged, position }: DraggableIconProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className='animate-scale origin-center select-none'
      ref={elementRef}
      data-id={icon.id}
      style={{
        animationDelay: `${index * 40}ms`,
        transform: "scale(0)",
        opacity: '0',
        position: "absolute",
        top: position.y + 10,
        left: position.x + 10,
        transition: beingDragged ? "none" : "top 0.2s ease-out, left 0.2s ease-out",
        zIndex: beingDragged ? 30 : 1,
        willChange: "top, left",
      }}
    >
      <div className={`w-24 h-24 flex flex-row justify-center`}>
        <Icon icon={icon} beingDragged={beingDragged} />
      </div>
    </div>
  );
}