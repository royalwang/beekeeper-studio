import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppEvent } from '../common/AppEvent';
import { DropzoneEnterEvent, DropzoneDropEvent } from '../common/dropzone';

const Dropzone: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const [lastTarget, setLastTarget] = useState<EventTarget | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isFile = useCallback((e: DragEvent): boolean => {
    return e.dataTransfer?.types.includes('Files') || false;
  }, []);

  const trigger = useCallback((eventName: string, event: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail: event }));
  }, []);

  const handleDragEnter = useCallback((e: DragEvent) => {
    if (isFile(e)) {
      setLastTarget(e.target);

      let prevented = false;

      const event: DropzoneEnterEvent = {
        event: e,
        files: [...(e.dataTransfer?.files || [])],
        preventDrop: () => {
          prevented = true;
        },
      };

      trigger(AppEvent.dropzoneEnter, event);

      if (!prevented) {
        setDragging(true);
      }
    }
  }, [isFile, trigger]);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (event.target === lastTarget || event.target === document) {
      setDragging(false);
    }
  }, [lastTarget]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (isFile(e)) {
      const event: DropzoneDropEvent = {
        event: e,
        files: [...(e.dataTransfer?.files || [])],
      };

      trigger(AppEvent.dropzoneDrop, event);
    }
  }, [isFile, trigger]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.addEventListener('dragenter', handleDragEnter);
    overlay.addEventListener('dragleave', handleDragLeave);
    overlay.addEventListener('dragover', handleDragOver);
    overlay.addEventListener('drop', handleDrop);

    return () => {
      overlay.removeEventListener('dragenter', handleDragEnter);
      overlay.removeEventListener('dragleave', handleDragLeave);
      overlay.removeEventListener('dragover', handleDragOver);
      overlay.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
    <div 
      ref={overlayRef}
      className="dropzone"
      data-dragging={dragging}
    />
  );
};

export default Dropzone;
