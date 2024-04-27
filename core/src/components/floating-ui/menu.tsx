import { useState, useRef, useMemo, createContext, useContext } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
  useInteractions,
  FloatingFocusManager,
  type Placement,
} from '@floating-ui/react';

interface MenuOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function useMenu({
  initialOpen = false,
  placement = 'bottom-start',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: MenuOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listItemsRef = useRef<HTMLElement[]>([]);
  const listContentRef = useRef<string[]>([]);

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

  const dismiss = useDismiss(context, {
    ancestorScroll: true,
  });
  const role = useRole(context, {
    role: 'menu',
  });
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    onNavigate: setActiveIndex,
    activeIndex,
  });
  const typeahead = useTypeahead(context, {
    enabled: open,
    listRef: listContentRef,
    onMatch: setActiveIndex,
    activeIndex,
  });

  const interactions = useInteractions([
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);

  return {
    open,
    setOpen,
    activeIndex,
    floating,
    interactions,
    listItemsRef,
    listContentRef,
  };
}

type ContextType = ReturnType<typeof useMenu>;

interface ContextItemType {
  setOpen: ContextType['setOpen'];
  interaction: Pick<ContextType['interactions'], 'getItemProps'>;
  listItemsRef: ContextType['listItemsRef'];
  listContentRef: ContextType['listContentRef'];
}

interface ContextTriggerType {
  setOpen: ContextType['setOpen'];
  floating: Pick<ContextType['floating'], 'refs'>;
}

const ContextContent = createContext<ContextType | null>(null);
const ContextItem = createContext<ContextItemType | null>(null);
const ContextTrigger = createContext<ContextTriggerType | null>(null);

function useMenuContext<T>(Context: React.Context<T | null>) {
  const menu = useContext(Context);

  if (menu == null) {
    throw new Error('Menu components must be wrapped in <Menu />');
  }

  return menu;
}

export function Menu({
  children,
  ...restOptions
}: {
  children: React.ReactNode;
} & MenuOptions) {
  const menu = useMenu(restOptions);

  // menu.interactions.getItemProps updates on open/close
  // open state can be also put in this context since it's already updated
  const contextItem = useMemo(
    () => ({
      setOpen: menu.setOpen,
      interaction: { getItemProps: menu.interactions.getItemProps },
      listItemsRef: menu.listItemsRef,
      listContentRef: menu.listContentRef,
    }),
    [
      menu.setOpen,
      menu.interactions.getItemProps,
      menu.listItemsRef,
      menu.listContentRef,
    ],
  );

  const contextTrigger = useMemo(
    () => ({
      setOpen: menu.setOpen,
      floating: { refs: menu.floating.refs },
    }),
    [menu.setOpen, menu.floating.refs],
  );

  return (
    <ContextContent.Provider value={menu}>
      <ContextTrigger.Provider value={contextTrigger}>
        <ContextItem.Provider value={contextItem}>
          {children}
        </ContextItem.Provider>
      </ContextTrigger.Provider>
    </ContextContent.Provider>
  );
}

export function MenuContent<T extends React.ElementType = 'div'>({
  as,
  children,
  style,
  ...props
}: {
  as?: T;
} & React.ComponentPropsWithoutRef<T>) {
  const Component = as || 'div';
  const { open, floating, interactions } = useMenuContext(ContextContent);

  if (!open) return null;

  return (
    <FloatingFocusManager
      context={floating.context}
      initialFocus={floating.refs.floating}
    >
      <Component
        style={{ ...floating.floatingStyles, ...style }}
        data-state={open ? 'open' : 'closed'}
        ref={floating.refs.setFloating}
        {...interactions.getFloatingProps(props)}
      >
        {children}
      </Component>
    </FloatingFocusManager>
  );
}

export function MenuItem<T extends React.ElementType = 'button'>({
  index,
  label,
  as,
  children,
  style,
  onClick,
  ...props
}: {
  index: number;
  label: string;
  as?: T;
} & React.ComponentPropsWithoutRef<T>) {
  const Component = as || 'button';
  const { setOpen, interaction, listItemsRef, listContentRef } =
    useMenuContext(ContextItem);
  listContentRef.current[index] = label;

  return (
    <Component
      ref={(node) => {
        node ? (listItemsRef.current[index] = node) : undefined;
      }}
      role="menuitem"
      // tabIndex={activeIndex === index ? 0 : -1}
      tabIndex={-1}
      {...interaction.getItemProps({
        // active: activeIndex == index,
        // selected: activeIndex == index,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          onClick?.(e);
          setOpen(false);
        },
        ...props,
      })}
    >
      {children ?? label}
    </Component>
  );
}

function useContextTrigger() {
  const { setOpen, floating } = useMenuContext(ContextTrigger);

  return (event: React.MouseEvent<HTMLElement>) => {
    floating.refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: event.clientX,
          y: event.clientY,
          top: event.clientY,
          left: event.clientX,
          right: event.clientX,
          bottom: event.clientY,
        };
      },
    });
    setOpen(true);
  };
}

export function MenuTriggerItem<T extends React.ElementType = 'button'>({
  as,
  onContextMenu,
  ...props
}: {
  as?: T;
  onContextMenu?: React.ComponentPropsWithoutRef<T>['onContextMenu'];
} & React.ComponentPropsWithoutRef<T>) {
  const Component = as || 'button';
  const contextTrigger = useContextTrigger();

  return (
    <Component
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
        contextTrigger(e);
      }}
      {...props}
    />
  );
}
