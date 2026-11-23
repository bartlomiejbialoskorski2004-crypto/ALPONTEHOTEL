import {
  GroupRoute,
  groupMetadata,
  groupStaticParams,
} from "@/components/GroupOffer";

export const generateMetadata = groupMetadata("schoolTrips");
export const generateStaticParams = groupStaticParams;

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <GroupRoute page="schoolTrips" params={params} />;
}
