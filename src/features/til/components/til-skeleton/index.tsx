import ContentListSkeleton from "~/_components/content-list-skeleton";

interface TilSkeletonProps {
  count?: number;
}

export default function TilSkeleton({ count = 5 }: TilSkeletonProps) {
  return <ContentListSkeleton count={count} variant="note" />;
}
