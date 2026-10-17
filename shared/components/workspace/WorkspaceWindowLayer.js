import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CropSquareRoundedIcon from "@mui/icons-material/CropSquareRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import FilterNoneRoundedIcon from "@mui/icons-material/FilterNoneRounded";
import Draggable from "react-draggable";

import { useWorkspaceWindows } from "@context/workspaceWindowContext";
import NegotiationSummaryPdfContent from "./NegotiationSummaryPdfContent";

const TASKBAR_HEIGHT = 58;
const EDGE_GAP = 12;

function WindowContent({ windowItem }) {
  if (windowItem.type === "negotiation-summary-pdf") {
    return <NegotiationSummaryPdfContent opId={windowItem.payload?.opId} />;
  }

  return null;
}

function FloatingWorkspaceWindow({ windowItem }) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const { minimizeWindow, closeWindow, focusWindow } = useWorkspaceWindows();
  const windowRef = useRef(null);
  const [maximized, setMaximized] = useState(false);
  const [position, setPosition] = useState(null);

  const defaultSize = useMemo(
    () => ({ width: "min(82vw, 1320px)", height: "min(82dvh, 900px)" }),
    []
  );

  useEffect(() => {
    if (isCompact || position || typeof window === "undefined") return;
    const estimatedWidth = Math.min(window.innerWidth * 0.82, 1320);
    const estimatedHeight = Math.min(window.innerHeight * 0.82, 900);
    setPosition({
      x: Math.max(EDGE_GAP, (window.innerWidth - estimatedWidth) / 2),
      y: Math.max(
        EDGE_GAP,
        (window.innerHeight - TASKBAR_HEIGHT - estimatedHeight) / 2
      ),
    });
  }, [isCompact, position]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      if (isCompact || maximized) return;
      setPosition((current) => {
        if (!current || !windowRef.current) return current;
        const rect = windowRef.current.getBoundingClientRect();
        const maxX = Math.max(
          EDGE_GAP,
          window.innerWidth - rect.width - EDGE_GAP
        );
        const maxY = Math.max(
          EDGE_GAP,
          window.innerHeight - TASKBAR_HEIGHT - rect.height - EDGE_GAP
        );
        return {
          x: Math.min(Math.max(current.x, EDGE_GAP), maxX),
          y: Math.min(Math.max(current.y, EDGE_GAP), maxY),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCompact, maximized]);

  const handleDrag = (_, data) => {
    if (isCompact || maximized || !windowRef.current || typeof window === "undefined") {
      return;
    }

    const rect = windowRef.current.getBoundingClientRect();
    const maxX = Math.max(
      EDGE_GAP,
      window.innerWidth - rect.width - EDGE_GAP
    );
    const maxY = Math.max(
      EDGE_GAP,
      window.innerHeight - TASKBAR_HEIGHT - rect.height - EDGE_GAP
    );

    setPosition({
      x: Math.min(Math.max(data.x, EDGE_GAP), maxX),
      y: Math.min(Math.max(data.y, EDGE_GAP), maxY),
    });
  };

  const positionStyles = isCompact
    ? {
        width: "100vw",
        height: `calc(100dvh - ${TASKBAR_HEIGHT}px)`,
        borderRadius: 0,
      }
    : maximized
    ? {
        width: `calc(100vw - ${EDGE_GAP * 2}px)`,
        height: `calc(100dvh - ${TASKBAR_HEIGHT + EDGE_GAP * 2}px)`,
        borderRadius: 2,
      }
    : {
        ...defaultSize,
        borderRadius: 2,
      };

  const draggablePosition = isCompact
    ? { x: 0, y: 0 }
    : maximized
    ? { x: EDGE_GAP, y: EDGE_GAP }
    : position || { x: EDGE_GAP, y: EDGE_GAP };

  return (
    <Draggable
      nodeRef={windowRef}
      handle=".workspace-window-drag-handle"
      cancel=".workspace-window-actions, .workspace-window-actions *"
      disabled={isCompact || maximized}
      position={draggablePosition}
      onStart={() => focusWindow(windowItem.id)}
      onDrag={handleDrag}
      onStop={handleDrag}
    >
    <Paper
      ref={windowRef}
      elevation={12}
      onMouseDown={() => focusWindow(windowItem.id)}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: windowItem.zIndex,
        display: windowItem.minimized ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid rgba(72,139,143,0.28)",
        boxShadow: "0 18px 55px rgba(18, 47, 54, 0.22)",
        backgroundColor: "#fff",
        ...positionStyles,
      }}
    >
      <Box
        className="workspace-window-drag-handle"
        sx={{
          minHeight: 52,
          px: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexShrink: 0,
          cursor: isCompact || maximized ? "default" : "move",
          userSelect: "none",
          borderBottom: "1px solid #dbe8e9",
          background: "linear-gradient(180deg, #f8fcfc 0%, #eef7f7 100%)",
        }}
      >
        <InsertDriveFileOutlinedIcon sx={{ color: "#488B8F", fontSize: 22 }} />
        <Typography
          sx={{
            fontWeight: 700,
            color: "#243c47",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {windowItem.title}
        </Typography>
        {!isCompact && !maximized && (
          <DragIndicatorRoundedIcon sx={{ color: "#8fb8ba", ml: "auto", mr: 1, fontSize: 24 }} />
        )}
        <Box
          className="workspace-window-actions"
          sx={{ ml: isCompact || maximized ? "auto" : 0, display: "flex" }}
        >
          <Tooltip title="Minimizar">
            <IconButton size="small" onClick={() => minimizeWindow(windowItem.id)}>
              <MinimizeRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {!isCompact && (
            <Tooltip title={maximized ? "Restaurar tamaño" : "Maximizar"}>
              <IconButton size="small" onClick={() => setMaximized((value) => !value)}>
                {maximized ? <FilterNoneRoundedIcon sx={{ fontSize: 18 }} /> : <CropSquareRoundedIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Cerrar">
            <IconButton size="small" onClick={() => closeWindow(windowItem.id)}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", backgroundColor: "#fff" }}>
        <WindowContent windowItem={windowItem} />
      </Box>
    </Paper>
    </Draggable>
  );
}

function WorkspaceTaskbar() {
  const { windows, restoreWindow, focusWindow, minimizeWindow } = useWorkspaceWindows();
  if (!windows.length) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: TASKBAR_HEIGHT,
        zIndex: 2200,
        px: { xs: 1, sm: 2 },
        display: "flex",
        alignItems: "center",
        gap: 1,
        background: "linear-gradient(180deg, #16383e 0%, #102e34 100%)",
        borderTop: "1px solid rgba(94,163,163,0.55)",
        boxShadow: "0 -5px 18px rgba(17, 45, 52, 0.18)",
      }}
    >
      <KeyboardArrowUpRoundedIcon sx={{ color: "#dceced", mr: 0.25 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
          overflowY: "hidden",
          flex: 1,
          py: 0.5,
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#5EA3A3", borderRadius: 2 },
        }}
      >
        {windows.map((item) => (
          <Box
            key={item.id}
            component="button"
            type="button"
            onClick={() => {
              if (item.minimized) restoreWindow(item.id);
              else {
                focusWindow(item.id);
                minimizeWindow(item.id);
              }
            }}
            sx={{
              minWidth: { xs: 190, sm: 250 },
              maxWidth: 320,
              height: 38,
              px: 1.25,
              borderRadius: 1.5,
              border: item.minimized ? "1px solid rgba(142,188,190,0.55)" : "1px solid #66b0b3",
              backgroundColor: item.minimized ? "rgba(255,255,255,0.05)" : "rgba(94,163,163,0.2)",
              color: "#eef7f7",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
              textAlign: "left",
              transition: "background-color .15s ease, border-color .15s ease",
              "&:hover": {
                backgroundColor: "rgba(94,163,163,0.3)",
                borderColor: "#78bdc0",
              },
            }}
          >
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: "#75c1c4" }} />
            <Typography
              component="span"
              sx={{
                fontSize: "0.8rem",
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {item.taskbarTitle || item.title}
            </Typography>
            <MinimizeRoundedIcon sx={{ fontSize: 17, color: "#cce3e4" }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function WorkspaceWindowLayer() {
  const { windows } = useWorkspaceWindows();
  if (!windows.length) return null;

  return (
    <>
      <Box sx={{ position: "fixed", inset: 0, zIndex: 1650, pointerEvents: "none" }}>
        {windows.map((item) => (
          <Box key={item.id} sx={{ pointerEvents: "auto" }}>
            <FloatingWorkspaceWindow windowItem={item} />
          </Box>
        ))}
      </Box>
      <WorkspaceTaskbar />
    </>
  );
}
