import BuySubscriptionPage from "@/components/BuySubscriptionPage/BuySubscriptionPage";
import { redirect } from "next/navigation";

async function getPlan(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/plan/get?id=${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch plan");
  }
  const data = await res.json();

  if (!data?.success) {
    throw new Error(data?.message);
  }
  return data?.data;
}

export default async function page({ searchParams }) {
  const id = searchParams.id;
  if (!id) {
    redirect("/pricing");
  }
  const currentPlanId = searchParams.currentPlanId;

  try {
    const plan = await getPlan(id);
    return <BuySubscriptionPage plan={plan} currentPlanId={currentPlanId} />;
  } catch (error) {
    console.error("Error fetching plan:", error);
    return (
      <div className="pt-24 grid place-items-center">
        {error.message
          ? error.message
          : "Error loading subscription plan. Please try again later."}
      </div>
    );
  }
}
