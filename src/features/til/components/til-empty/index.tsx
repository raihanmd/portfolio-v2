export default function TilEmpty() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        Nothing here yet — check back soon for new learnings.
      </p>
      <p className="mt-1 text-xs text-muted-foreground/60">
        I&apos;m always picking up something new.
      </p>
    </div>
  );
}