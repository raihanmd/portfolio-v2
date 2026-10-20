"use client";

import {
  Eye,
  EyeOff,
  Maximize2,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react";

import { Button } from "~/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/_components/ui/dialog";
import { Input } from "~/_components/ui/input";
import { cn } from "~/lib/cn";

import { formatVector, parseVectorExpression, valuesForFit } from "./math";
import type {
  ParsedVectorExpression,
  VectorColor,
  Vector2DPlaygroundConfig,
  VectorExpressionConfig,
  VectorValue,
} from "./types";

const COLOR_TOKENS: Record<VectorColor, string> = {
  blue: "--vector-blue",
  green: "--vector-green",
  orange: "--vector-orange",
  purple: "--vector-purple",
};

const VECTOR_COLORS = Object.keys(COLOR_TOKENS) as VectorColor[];

const FALLBACK_EXPRESSIONS: VectorExpressionConfig[] = [
  { expression: "[2, 3]", label: "v", visual: "arrow", color: "blue" },
];

interface EditableExpression extends VectorExpressionConfig {
  id: string;
  customColor?: string;
  visible: boolean;
}

interface Viewport {
  centerX: number;
  centerY: number;
  unitsPerPixel: number;
}

function initialExpressions(
  config: Vector2DPlaygroundConfig,
): EditableExpression[] {
  return (
    config.expressions?.length ? config.expressions : FALLBACK_EXPRESSIONS
  ).map((item, index) => ({
    id: `vector-expression-${index}`,
    expression: item.expression ?? "",
    label: item.label ?? "",
    visual: item.visual ?? "arrow",
    color: item.color ?? "blue",
    visible: true,
  }));
}

function getViewport(
  expressions: Array<ParsedVectorExpression | null>,
): Viewport {
  const values = valuesForFit(expressions);
  const max = Math.max(
    4,
    ...values.flatMap((value) => [Math.abs(value.x), Math.abs(value.y)]),
  );
  return { centerX: 0, centerY: 0, unitsPerPixel: (max * 2.5) / 600 };
}

interface HslColor {
  hue: number;
  saturation: number;
  lightness: number;
}

function hexToHsl(hex: string): HslColor | null {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!match) return null;
  const red = Number.parseInt(match[1] ?? "0", 16) / 255;
  const green = Number.parseInt(match[2] ?? "0", 16) / 255;
  const blue = Number.parseInt(match[3] ?? "0", 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;
  const lightness = (max + min) / 2;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  return { hue, saturation: saturation * 100, lightness: lightness * 100 };
}

function parseHsl(value: string): HslColor | null {
  const match = /^\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/.exec(value);
  if (!match) return null;
  return {
    hue: Number(match[1]),
    saturation: Number(match[2]),
    lightness: Number(match[3]),
  };
}

function rotateHue(color: HslColor, degrees: number): string {
  const hue = (color.hue + degrees) % 360;
  return `hsl(${hue} ${color.saturation}% ${color.lightness}%)`;
}

function normalizeForCanvas(color: HslColor, darkMode: boolean): HslColor {
  return {
    hue: color.hue,
    saturation: Math.min(82, Math.max(62, color.saturation)),
    lightness: darkMode ? 68 : 36,
  };
}

function randomColorFor(expressions: EditableExpression[]): VectorColor {
  const unused = VECTOR_COLORS.filter(
    (color) => !expressions.some((expression) => expression.color === color),
  );
  const previous = expressions.at(-1)?.color;
  const pool = unused.length
    ? unused
    : VECTOR_COLORS.filter((color) => color !== previous);
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  return pool[(random[0] ?? 0) % pool.length] ?? "blue";
}

function drawArrow(
  context: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  dashed = false,
  width = 2,
) {
  if (Math.hypot(to.x - from.x, to.y - from.y) < 0.5) return;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const head = 9;
  context.save();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = width;
  context.setLineDash(dashed ? [6, 5] : []);
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
  context.setLineDash([]);
  context.beginPath();
  context.moveTo(to.x, to.y);
  context.lineTo(
    to.x - head * Math.cos(angle - Math.PI / 6),
    to.y - head * Math.sin(angle - Math.PI / 6),
  );
  context.lineTo(
    to.x - head * Math.cos(angle + Math.PI / 6),
    to.y - head * Math.sin(angle + Math.PI / 6),
  );
  context.closePath();
  context.fill();
  context.restore();
}

export default function Vector2DPlayground({
  config,
}: {
  config: Vector2DPlaygroundConfig;
}) {
  const inlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [expressions, setExpressions] = useState(() =>
    initialExpressions(config),
  );
  const [viewport, setViewport] = useState<Viewport>(() =>
    getViewport(
      expressions.map((item) => parseVectorExpression(item.expression)),
    ),
  );
  const [animationKey, setAnimationKey] = useState(0);
  const [progress, setProgress] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [openColorId, setOpenColorId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canvasRevision, setCanvasRevision] = useState(0);
  const [themeRevision, setThemeRevision] = useState(0);
  const dragOrigin = useRef<{
    x: number;
    y: number;
    viewport: Viewport;
  } | null>(null);

  const parsed = useMemo(
    () => expressions.map((item) => parseVectorExpression(item.expression)),
    [expressions],
  );
  const visibleParsed = useMemo(
    () =>
      parsed.map((expression, index) =>
        expressions[index]?.visible === false ? null : expression,
      ),
    [expressions, parsed],
  );
  const allowEditing = config.allowEditing !== false;
  const allowPanZoom = config.allowPanZoom !== false;

  const resetViewport = useCallback(() => {
    setViewport(getViewport(visibleParsed));
  }, [visibleParsed]);

  const replay = useCallback(() => {
    setAnimationKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setProgress(1);
      return;
    }
    setProgress(0);
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(1, (now - startedAt) / 900);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animationKey]);

  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setCanvasRevision((value) => value + 1);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeRevision((value) => value + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = isModalOpen
      ? modalCanvasRef.current
      : inlineCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const styles = getComputedStyle(canvas);
    const colorsFor = (
      item: Pick<EditableExpression, "color" | "customColor">,
    ) => {
      const base = item.customColor
        ? hexToHsl(item.customColor)
        : parseHsl(
            styles.getPropertyValue(COLOR_TOKENS[item.color ?? "blue"]).trim(),
          );
      const background = parseHsl(
        styles.getPropertyValue("--background").trim(),
      );
      const darkMode = (background?.lightness ?? 100) < 50;
      const color = normalizeForCanvas(
        base ?? { hue: 220, saturation: 70, lightness: 50 },
        darkMode,
      );
      return {
        first: rotateHue(color, 0),
        second: rotateHue(color, 90),
        result: rotateHue(color, 180),
      };
    };
    const width = Math.max(280, rect.width);
    const height = isModalOpen
      ? Math.max(420, Math.min(720, window.innerHeight - 180))
      : Math.max(300, Math.min(520, width * 0.78));
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const toScreen = (value: VectorValue) => ({
      x: width / 2 + (value.x - viewport.centerX) / viewport.unitsPerPixel,
      y: height / 2 - (value.y - viewport.centerY) / viewport.unitsPerPixel,
    });
    const toWorld = (x: number, y: number) => ({
      x: viewport.centerX + (x - width / 2) * viewport.unitsPerPixel,
      y: viewport.centerY - (y - height / 2) * viewport.unitsPerPixel,
    });

    context.fillStyle = "#00000000";
    context.fillRect(0, 0, width, height);
    const rawGridStep = viewport.unitsPerPixel * 56;
    const magnitude = 10 ** Math.floor(Math.log10(rawGridStep));
    const normalizedGridStep = rawGridStep / magnitude;
    const stepMultiplier =
      normalizedGridStep < 1.5
        ? 1
        : normalizedGridStep < 3
          ? 2
          : normalizedGridStep < 7
            ? 5
            : 10;
    const gridStep = stepMultiplier * magnitude;
    const tickLabel = (value: number) => {
      const decimals = Math.max(0, Math.ceil(-Math.log10(gridStep)));
      return value.toFixed(decimals).replace(/\.0+$/, "");
    };
    const left = toWorld(0, 0).x;
    const right = toWorld(width, 0).x;
    const top = toWorld(0, 0).y;
    const bottom = toWorld(0, height).y;
    if (config.showGrid !== false) {
      context.strokeStyle = "rgba(148, 163, 184, 0.16)";
      context.lineWidth = 1;
      for (
        let x = Math.floor(left / gridStep) * gridStep;
        x <= right;
        x += gridStep
      ) {
        const point = toScreen({ x, y: 0 });
        context.beginPath();
        context.moveTo(point.x, 0);
        context.lineTo(point.x, height);
        context.stroke();
      }
      for (
        let y = Math.floor(bottom / gridStep) * gridStep;
        y <= top;
        y += gridStep
      ) {
        const point = toScreen({ x: 0, y });
        context.beginPath();
        context.moveTo(0, point.y);
        context.lineTo(width, point.y);
        context.stroke();
      }
    }
    if (config.showAxes !== false) {
      context.strokeStyle = "rgba(148, 163, 184, 0.7)";
      context.lineWidth = 1.5;
      const origin = toScreen({ x: 0, y: 0 });
      context.beginPath();
      context.moveTo(0, origin.y);
      context.lineTo(width, origin.y);
      context.moveTo(origin.x, 0);
      context.lineTo(origin.x, height);
      context.stroke();
    }
    const origin = toScreen({ x: 0, y: 0 });
    if (config.showAxes !== false) {
      const mutedForeground = `hsl(${styles.getPropertyValue("--muted-foreground").trim()})`;
      context.fillStyle = mutedForeground;
      context.font = "11px Geist, system-ui, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "top";
      for (
        let x = Math.ceil(left / gridStep) * gridStep;
        x <= right;
        x += gridStep
      ) {
        if (Math.abs(x) < gridStep / 100) continue;
        const point = toScreen({ x, y: 0 });
        context.fillText(
          tickLabel(x),
          point.x,
          Math.min(height - 15, Math.max(4, origin.y + 5)),
        );
      }
      context.textAlign = "left";
      context.textBaseline = "middle";
      for (
        let y = Math.ceil(bottom / gridStep) * gridStep;
        y <= top;
        y += gridStep
      ) {
        if (Math.abs(y) < gridStep / 100) continue;
        const point = toScreen({ x: 0, y });
        context.fillText(
          tickLabel(y),
          Math.min(width - 28, Math.max(4, origin.x + 6)),
          point.y,
        );
      }
    }

    const drawProgress = (value: VectorValue, amount: number) => ({
      x: value.x * amount,
      y: value.y * amount,
    });
    parsed.forEach((expression, index) => {
      if (!expression) return;
      const item = expressions[index];
      if (item?.visible === false) return;
      const colors = colorsFor(item ?? { color: "blue" });
      const visual = item?.visual ?? "arrow";
      if (expression.type === "vector") {
        const endpoint = toScreen(drawProgress(expression.value, progress));
        if (visual === "dot") {
          context.fillStyle = colors.first;
          context.beginPath();
          context.arc(endpoint.x, endpoint.y, 5 + progress * 2, 0, Math.PI * 2);
          context.fill();
        } else
          drawArrow(context, toScreen({ x: 0, y: 0 }), endpoint, colors.first);
        return;
      }
      const firstProgress = Math.min(1, progress / 0.35);
      const secondProgress = Math.min(1, Math.max(0, (progress - 0.35) / 0.35));
      const resultProgress = Math.min(1, Math.max(0, (progress - 0.7) / 0.3));
      const first = toScreen(drawProgress(expression.left, firstProgress));
      drawArrow(context, toScreen({ x: 0, y: 0 }), first, colors.first);
      if (secondProgress > 0) {
        const firstEndpoint = toScreen(expression.left);
        const translatedEnd = toScreen({
          x: expression.left.x + expression.right.x * secondProgress,
          y: expression.left.y + expression.right.y * secondProgress,
        });
        drawArrow(context, firstEndpoint, translatedEnd, colors.second);
      }
      if (resultProgress > 0) {
        drawArrow(
          context,
          toScreen({ x: 0, y: 0 }),
          toScreen(drawProgress(expression.value, resultProgress)),
          colors.result,
          true,
          3,
        );
      }
    });
  }, [
    canvasRevision,
    config.showAxes,
    config.showGrid,
    expressions,
    isModalOpen,
    parsed,
    progress,
    themeRevision,
    viewport,
  ]);

  const updateExpression = (id: string, value: string) => {
    setExpressions((items) =>
      items.map((item) =>
        item.id === id ? { ...item, expression: value } : item,
      ),
    );
  };

  const addExpression = () => {
    if (!allowEditing || expressions.length >= 12) return;
    setExpressions((items) => {
      const color = randomColorFor(items);
      return [
        ...items,
        {
          id: `vector-expression-${crypto.randomUUID()}`,
          expression: "",
          label: "",
          visual: "arrow",
          color,
          visible: true,
        },
      ];
    });
  };

  const removeExpression = (id: string) => {
    if (!allowEditing || expressions.length <= 1) return;
    setExpressions((items) => items.filter((item) => item.id !== id));
    setOpenColorId(null);
  };

  const toggleExpression = (id: string) => {
    setExpressions((items) =>
      items.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item,
      ),
    );
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!allowPanZoom) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    dragOrigin.current = { x: event.clientX, y: event.clientY, viewport };
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!dragOrigin.current || !allowPanZoom) return;
    const origin = dragOrigin.current;
    setViewport({
      ...origin.viewport,
      centerX:
        origin.viewport.centerX -
        (event.clientX - origin.x) * origin.viewport.unitsPerPixel,
      centerY:
        origin.viewport.centerY +
        (event.clientY - origin.y) * origin.viewport.unitsPerPixel,
    });
  };

  const handleWheel = (event: WheelEvent<HTMLCanvasElement>) => {
    if (!allowPanZoom) return;
    event.preventDefault();
    const factor = event.deltaY > 0 ? 1.1 : 0.9;
    setViewport((current) => ({
      ...current,
      unitsPerPixel: Math.min(
        10,
        Math.max(0.005, current.unitsPerPixel * factor),
      ),
    }));
  };

  const renderHeader = (showExpand: boolean, showClose = false) => (
    <div className="border-b border-border bg-muted/30 px-4 py-3 md:px-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">
            Vector 2D Playground
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Enter vectors as [x, y]. Use + to show vector addition.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            aria-label="Replay animation"
            size="icon"
            variant="ghost"
            onClick={replay}
            title="Replay animation"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {showExpand && (
            <DialogTrigger asChild>
              <Button
                aria-label="Open expanded playground"
                size="icon"
                variant="ghost"
                title="Open expanded playground"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          )}
          {showClose && (
            <DialogClose asChild>
              <Button
                aria-label="Close expanded playground"
                size="icon"
                variant="ghost"
                title="Close expanded playground"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          )}
        </div>
      </div>
    </div>
  );

  const renderBody = (modal: boolean) => (
    <>
      <div className="grid gap-0 lg:grid-cols-[minmax(250px,280px)_minmax(0,1fr)]">
        <div className="border-b border-border p-3 md:p-4 lg:border-b-0 lg:border-r">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Expressions
            </p>
            <span className="text-[11px] text-muted-foreground">
              {expressions.length}/12
            </span>
          </div>
          <div className="space-y-1">
            {expressions.map((item, index) => {
              const error = item.expression.trim() && !parsed[index];
              return (
                <div key={item.id} className="group relative space-y-1">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border border-transparent px-1 py-1 transition-colors focus-within:border-ring focus-within:bg-muted/40 hover:border-border hover:bg-muted/40",
                      !item.visible && "text-muted-foreground",
                    )}
                  >
                    <div className="relative shrink-0">
                      <button
                        aria-expanded={openColorId === item.id}
                        aria-label={`Choose color for expression ${index + 1}`}
                        className="h-5 w-5 rounded-full border-2 bg-transparent p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                        disabled={
                          !allowEditing || config.allowColorChange === false
                        }
                        style={{
                          borderColor:
                            item.customColor ??
                            `hsl(var(${COLOR_TOKENS[item.color ?? "blue"]}))`,
                        }}
                        type="button"
                        onClick={() =>
                          setOpenColorId((current) =>
                            current === item.id ? null : item.id,
                          )
                        }
                      >
                        <span
                          className="block h-full w-full rounded-full"
                          style={{
                            backgroundColor:
                              item.customColor ??
                              `hsl(var(${COLOR_TOKENS[item.color ?? "blue"]}))`,
                          }}
                        />
                      </button>
                      {openColorId === item.id &&
                        config.allowColorChange !== false && (
                          <div className="absolute left-0 top-7 z-20 w-36 rounded-md border border-border bg-popover p-2 shadow-lg">
                            <div className="grid grid-cols-4 gap-1.5">
                              {(Object.keys(COLOR_TOKENS) as VectorColor[]).map(
                                (color) => (
                                  <button
                                    key={color}
                                    aria-label={`Use ${color}`}
                                    className="h-7 w-7 rounded-full border-2 border-transparent p-1 hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    disabled={!allowEditing}
                                    type="button"
                                    onClick={() => {
                                      setExpressions((items) =>
                                        items.map((current) =>
                                          current.id === item.id
                                            ? {
                                                ...current,
                                                color,
                                                customColor: undefined,
                                              }
                                            : current,
                                        ),
                                      );
                                      setOpenColorId(null);
                                    }}
                                  >
                                    <span
                                      className="block h-full w-full rounded-full"
                                      style={{
                                        backgroundColor: `hsl(var(${COLOR_TOKENS[color]}))`,
                                      }}
                                    />
                                  </button>
                                ),
                              )}
                            </div>
                            <label className="mt-2 flex cursor-pointer items-center justify-between gap-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
                              Custom
                              <input
                                aria-label="Choose a custom color"
                                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                                disabled={!allowEditing}
                                type="color"
                                value={item.customColor ?? "#60a5fa"}
                                onChange={(event) => {
                                  const customColor = event.target.value;
                                  setExpressions((items) =>
                                    items.map((current) =>
                                      current.id === item.id
                                        ? { ...current, customColor }
                                        : current,
                                    ),
                                  );
                                }}
                              />
                            </label>
                          </div>
                        )}
                    </div>
                    <Input
                      aria-label={`Vector expression ${index + 1}`}
                      className={cn(
                        "h-8 min-w-0 flex-1 border-0 bg-transparent px-1 font-mono text-sm shadow-none focus-visible:ring-0",
                        !allowEditing && "cursor-not-allowed opacity-70",
                      )}
                      disabled={!allowEditing}
                      value={item.expression}
                      onChange={(event) =>
                        updateExpression(item.id, event.target.value)
                      }
                    />
                    <Button
                      aria-label={`${item.visible ? "Hide" : "Show"} expression ${index + 1}`}
                      aria-pressed={!item.visible}
                      className={cn(
                        "h-7 w-7 shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100",
                        !item.visible && "opacity-100",
                      )}
                      disabled={!allowEditing}
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleExpression(item.id)}
                      title={`${item.visible ? "Hide" : "Show"} expression`}
                    >
                      {item.visible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      aria-label={`Remove expression ${index + 1}`}
                      className="h-7 w-7 shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                      disabled={!allowEditing || expressions.length <= 1}
                      size="icon"
                      variant="ghost"
                      onClick={() => removeExpression(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {error && (
                    <p className="px-8 text-[11px] text-destructive">
                      Use [x, y] or [x, y] + [x, y].
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            className="mt-2 h-8 w-full justify-start gap-2 px-2 text-xs"
            disabled={!allowEditing || expressions.length >= 12}
            variant="ghost"
            onClick={addExpression}
          >
            <Plus className="h-3.5 w-3.5" />
            Add expression
          </Button>
        </div>
        <div className="min-w-0 bg-muted/10 p-3 md:p-4">
          <div
            className={cn(
              "relative cursor-grab overflow-hidden rounded-md border border-border bg-background",
              dragging && "cursor-grabbing",
            )}
          >
            <canvas
              ref={modal ? modalCanvasRef : inlineCanvasRef}
              aria-label="Interactive vector graph"
              className="block w-full touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={() => {
                dragOrigin.current = null;
                setDragging(false);
              }}
              onPointerCancel={() => {
                dragOrigin.current = null;
                setDragging(false);
              }}
              onWheel={handleWheel}
            />
          </div>
          <div className="mt-2 flex items-center justify-end gap-1">
            <Button
              className="h-7 gap-1.5 px-2 text-xs"
              variant="ghost"
              onClick={resetViewport}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset view
            </Button>
          </div>
          <p className="sr-only" aria-live="polite">
            {expressions
              .map((item, index) => {
                const value = parsed[index];
                if (!item.visible) {
                  return `${item.label ?? `Vector ${index + 1}`} hidden`;
                }
                return value
                  ? `${item.label ?? `Vector ${index + 1}`} ${formatVector(value.value)}`
                  : null;
              })
              .filter(Boolean)
              .join(". ")}
          </p>
        </div>
      </div>
      {config.caption && (
        <figcaption className="border-t border-border px-4 pb-4 text-center text-xs italic text-muted-foreground md:px-5">
          {config.caption}
        </figcaption>
      )}
    </>
  );

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        setOpenColorId(null);
      }}
    >
      <figure className="my-6 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        {renderHeader(true)}
        {!isModalOpen && renderBody(false)}
      </figure>

      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-6xl gap-0 overflow-hidden p-0 sm:rounded-xl [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Vector 2D Playground</DialogTitle>
          <DialogDescription>
            Edit vector expressions and explore them on an interactive Cartesian
            graph.
          </DialogDescription>
        </DialogHeader>
        <figure className="min-h-0 overflow-y-auto bg-background">
          {renderHeader(false, true)}
          {renderBody(true)}
        </figure>
      </DialogContent>
    </Dialog>
  );
}
