import { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Icon from './icon';
import { FullFileData } from '../services/file';


type DraggableIconProps = {
  icon: FullFileData;
  onStart: (e: DraggableEvent, data: DraggableData, iconId: string) => void;
  onDrag: (e: DraggableEvent, data: DraggableData, iconId: string) => void;
  onStop: (e: DraggableEvent, data: DraggableData, iconId: string) => void;
};

export function DraggableIcon({ icon, onStart, onDrag, onStop }: DraggableIconProps) {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      key={icon.id}
      position={icon.position}
      onStart={(e, data) => onStart(e, data, icon.id)}
      onDrag={(e, data) => onDrag(e, data, icon.id)}
      onStop={(e, data) => onStop(e, data, icon.id)}
      grid={[100, 100]}
      bounds={{ left: 0, top: 0 }}
    >
      <div ref={nodeRef} className="absolute cursor-move w-24 h-24 transition-all duration-100">
        <Icon {...icon} />
      </div>
    </Draggable>
  );
}
