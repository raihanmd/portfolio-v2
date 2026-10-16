import ShareButton from "~/_components/share-button";

interface BlogShareButtonProps {
  title: string;
  className?: string;
}

export default function BlogShareButton({
  title,
  className,
}: BlogShareButtonProps) {
  return (
    <ShareButton
      title={title}
      ariaLabel="Share this article"
      className={className}
    />
  );
}
