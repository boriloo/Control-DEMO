import { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Icon from './icon';
import { FileData } from '../types/file';


type DraggableIconProps = {
  icon: FileData;
  beingDragged: boolean;
  onStart: (e: DraggableEvent, data: DraggableData, iconId: string) => void;
  onDrag: (e: DraggableEvent, data: DraggableData, iconId: string) => void;
  onStop: (e: DraggableEvent, data: DraggableData, iconId: string) => void;
};

export function DraggableIcon({ icon, beingDragged, onStart, onDrag, onStop }: DraggableIconProps) {
  const position = { x: icon.xPos, y: icon.yPos }
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      key={icon.id}
      position={position}
      onStart={(e, data) => onStart(e, data, icon.id)}
      onDrag={(e, data) => onDrag(e, data, icon.id)}
      onStop={(e, data) => onStop(e, data, icon.id)}
      bounds={{ left: 0, top: 0 }}
    >
      <div ref={nodeRef} className={`absolute cursor-move flex flex-row justify-center w-24 h-24 ${beingDragged ? 'z-100' : 'transition-all duration-100'}`}>
        <Icon icon={icon} beingDragged={beingDragged} />
      </div>
    </Draggable>
  );
}
