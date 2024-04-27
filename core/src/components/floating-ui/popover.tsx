'use client';

import { useState, useMemo, createContext, useContext } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useTransitionStatus,
  FloatingFocusManager,
  type Placement,
} from '@floating-ui/react';

/**
 * https://floating-ui.com/docs/popover#reusable-popover-component
 */

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  duration?: number | Partial<{ open: number; close: number }>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function usePopover({
  initialOpen = false,
  placement = 'bottom-start',
  duration = { open: 300, close: 100 },
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: PopoverOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const floating = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = floating.context;

  const click = useClick(context, {
    enabled: controlledOpen == undefined,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  const transition = useTransitionStatus(context, {
    duration,
  });

  return useMemo(
    () => ({
      open,
      setOpen,
      floating,
      interactions,
      transition,
    }),
    [open, setOpen, floating, interactions, transition],
  );
}

type ContextType = ReturnType<typeof usePopover>;

const PopoverContext = createContext<ContextType | null>(null);

function usePopoverContext() {
  const popover = useContext(PopoverContext);

  if (popover == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return popover;
}

export function Popover({
  children,
  ...restOptions
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover(restOptions);

  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
  ...props
}: React.HTMLProps<HTMLButtonElement>) {
  const { open, floating, interactions } = usePopoverContext();
  return (
    <button
      type="button"
      // The user can style the trigger based on the state
      data-state={open ? 'open' : 'closed'}
      ref={floating.refs.setReference}
      {...interactions.getReferenceProps(props)}
    >
      {children}
    </button>
  );
}

export function PopoverContent<T extends React.ElementType = 'div'>({
  modal = false,
  as,
  children,
  style,
  ...props
}: {
  modal?: boolean;
  as?: T;
} & React.ComponentPropsWithoutRef<T>) {
  const Component = as || 'div';
  const { floating, interactions, transition } = usePopoverContext();

  if (!transition.isMounted) return null;

  return (
    // <FloatingPortal>
    <FloatingFocusManager context={floating.context} modal={modal}>
      <Component
        style={{ ...floating.floatingStyles, ...style }}
        data-status={transition.status}
        ref={floating.refs.setFloating}
        {...interactions.getFloatingProps(props)}
      >
        {children}
      </Component>
    </FloatingFocusManager>
    // </FloatingPortal>
  );
}

// export const PopoverHeading = forwardRef<
//   HTMLHeadingElement,
//   React.HTMLProps<HTMLHeadingElement>
// >(function PopoverHeading(props, ref) {
//   const { setLabelId } = usePopoverContext();
//   const id = useId();

//   // Only sets `aria-labelledby` on the Popover root element
//   // if this component is mounted inside it.
//   useLayoutEffect(() => {
//     setLabelId(id);
//     return () => setLabelId(undefined);
//   }, [id, setLabelId]);

//   return (
//     <h2 {...props} ref={ref} id={id}>
//       {props.children}
//     </h2>
//   );
// });

// export const PopoverDescription = forwardRef<
//   HTMLParagraphElement,
//   React.HTMLProps<HTMLParagraphElement>
// >(function PopoverDescription(props, ref) {
//   const { setDescriptionId } = usePopoverContext();
//   const id = useId();

//   // Only sets `aria-describedby` on the Popover root element
//   // if this component is mounted inside it.
//   useLayoutEffect(() => {
//     setDescriptionId(id);
//     return () => setDescriptionId(undefined);
//   }, [id, setDescriptionId]);

//   return <p {...props} ref={ref} id={id} />;
// });

// export const PopoverClose = forwardRef<
//   HTMLButtonElement,
//   React.ButtonHTMLAttributes<HTMLButtonElement>
// >(function PopoverClose(props, ref) {
//   const { setOpen } = usePopoverContext();
//   return (
//     <button
//       type="button"
//       ref={ref}
//       {...props}
//       onClick={(event) => {
//         props.onClick?.(event);
//         setOpen(false);
//       }}
//     />
//   );
// });
