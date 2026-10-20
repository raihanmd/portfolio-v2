import { Button } from "~/_components/ui/button";

interface PlaygroundErrorProps {
  message: string | null;
  onRetry: () => void;
}

export default function PlaygroundError({
  message,
  onRetry,
}: PlaygroundErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center"
    >
      <p className="text-sm font-medium text-foreground">
        Couldn&apos;t load the playground catalog.
      </p>
      {message ? (
        <p className="mt-1 text-xs text-muted-foreground">{message}</p>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="mt-4 min-h-11"
      >
        Try again
      </Button>
    </div>
  );
}
