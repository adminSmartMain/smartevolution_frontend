import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const WorkspaceWindowContext = createContext(null);

export function WorkspaceWindowProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const zIndexRef = useRef(1700);

  const nextZIndex = useCallback(() => {
    zIndexRef.current += 1;
    return zIndexRef.current;
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows((current) =>
      current.map((item) =>
        item.id === id ? { ...item, zIndex: nextZIndex() } : item
      )
    );
  }, [nextZIndex]);

  const openWindow = useCallback((config) => {
    setWindows((current) => {
      const existing = current.find((item) => item.id === config.id);
      const zIndex = nextZIndex();

      if (existing) {
        return current.map((item) =>
          item.id === config.id
            ? {
                ...item,
                ...config,
                minimized: false,
                zIndex,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...config,
          minimized: false,
          zIndex,
        },
      ];
    });
  }, [nextZIndex]);

  const minimizeWindow = useCallback((id) => {
    setWindows((current) =>
      current.map((item) =>
        item.id === id ? { ...item, minimized: true } : item
      )
    );
  }, []);

  const restoreWindow = useCallback((id) => {
    setWindows((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, minimized: false, zIndex: nextZIndex() }
          : item
      )
    );
  }, [nextZIndex]);

  const closeWindow = useCallback((id) => {
    setWindows((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      focusWindow,
    }),
    [windows, openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow]
  );

  return (
    <WorkspaceWindowContext.Provider value={value}>
      {children}
    </WorkspaceWindowContext.Provider>
  );
}

export function useWorkspaceWindows() {
  const context = useContext(WorkspaceWindowContext);

  if (!context) {
    throw new Error("useWorkspaceWindows must be used inside WorkspaceWindowProvider");
  }

  return context;
}
