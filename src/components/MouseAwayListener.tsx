import React, { ReactElement, Ref, SyntheticEvent, useEffect, useRef } from "react";
import { isChildOf } from "../utils/reactUtils";

export interface IMouseAwayListenerProps {
  children?: ReactElement<{ ref: Ref<HTMLElement> }>;
  onMouseAway?(e: SyntheticEvent): void;
}

export default function MouseAwayListener({ children, onMouseAway }: IMouseAwayListenerProps) {
  const ref = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const eventTypes = [
      'mousemove', 'click',
      'touchend', 'touchmove',
    ] as const;
    
    const listener = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const synth = createEvent(e);
      
      if (!eventTypes.includes(e.type as any)) {
        console.warn(`Unexpected event type ${e.type}`);
      }
      
      if (ref.current && !isChildOf(ref.current, target, e.type === 'click')) {
        onMouseAway?.(synth);
      }
    };
    
    eventTypes.forEach(
      type => document.addEventListener(type, listener)
    );
    
    return () => {
      eventTypes.forEach(
        type => document.removeEventListener(type, listener)
      );
    }
  }, [onMouseAway]);
  
  if (!children) return null;
  return <>{React.cloneElement(children, {ref})}</>
}

const createEvent = (native: Event): SyntheticEvent => ({
  type: 'mouseaway',
  bubbles: false,
  cancelable: false,
  target: native.target!,
  currentTarget: native.currentTarget as Element,
  defaultPrevented: false,
  isDefaultPrevented: () => false,
  isPropagationStopped: () => false,
  isTrusted: false,
  eventPhase: 0,
  nativeEvent: native,
  persist() {},
  preventDefault() {
    this.defaultPrevented = true;
  },
  stopPropagation() {},
  timeStamp: Date.now(),
});
