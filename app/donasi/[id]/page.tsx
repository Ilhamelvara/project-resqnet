"use client";

import DonasiPage from '../page';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return <DonasiPage campaignId={params.id} />;
}
