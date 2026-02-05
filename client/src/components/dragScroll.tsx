import { useRef, useEffect, RefObject } from 'react';

export const useDraggableScroll = (ref: RefObject<HTMLElement | null>) => {

  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    startY: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target !== element && e.target !== element.firstChild) {
        return;
      }
      e.preventDefault();
      dragState.current.isDown = true;
      element.classList.add('active:cursor-grabbing');

      dragState.current.startX = e.pageX - element.offsetLeft;
      dragState.current.scrollLeft = element.scrollLeft;
      dragState.current.startY = e.pageY - element.offsetTop;
      dragState.current.scrollTop = element.scrollTop;
    };

    const handleMouseLeaveOrUp = () => {
      dragState.current.isDown = false;
      element.classList.remove('active:cursor-grabbing');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDown) return;
      e.preventDefault();

      const x = e.pageX - element.offsetLeft;
      const walkX = (x - dragState.current.startX) * 2;
      element.scrollLeft = dragState.current.scrollLeft - walkX;

      const y = e.pageY - element.offsetTop;
      const walkY = (y - dragState.current.startY) * 2;
      element.scrollTop = dragState.current.scrollTop - walkY;
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseleave', handleMouseLeaveOrUp);
    element.addEventListener('mouseup', handleMouseLeaveOrUp);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseleave', handleMouseLeaveOrUp);
      element.removeEventListener('mouseup', handleMouseLeaveOrUp);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);
};

