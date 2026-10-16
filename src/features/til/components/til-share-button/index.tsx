import ShareButton from "~/_components/share-button";

interface TilShareButtonProps {
  title: string;
  className?: string;
}

export default function TilShareButton({
  title,
  className,
}: TilShareButtonProps) {
  return (
    <ShareButton
      title={title}
      ariaLabel="Share this TIL"
      className={className}
    />
  );
}
