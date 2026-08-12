import { notFound } from "next/navigation";

import TilDetailModal from "~/features/til/components/til-detail-modal";
import { fetchTilById } from "~/lib/fetch-til";

export const dynamic = "force-dynamic";

interface TilDetailModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function TilDetailModalPage({
  params,
}: TilDetailModalPageProps) {
  const { id } = await params;
  const til = await fetchTilById(id);
  if (!til) notFound();

  return <TilDetailModal til={til} />;
}
