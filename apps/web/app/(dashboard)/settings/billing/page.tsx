"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Check, Loader2, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Suspense } from "react";

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
}

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: ["100 credits/month", "5 basic models", "Standard queue"],
  PRO: ["2,000 credits/month", "All models", "Compare mode", "Priority queue"],
  TEAM: ["5,000 credits/month", "All models", "Compare mode", "Priority queue", "10 team seats", "API access"],
};

function BillingContent() {
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      toast.success("Subscription activated! Your credits have been updated.");
    }
    if (searchParams.get("canceled") === "1") {
      toast.error("Checkout canceled.");
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery<{ plans: Plan[] }>({
    queryKey: ["plans"],
    queryFn: () => apiClient.get<{ plans: Plan[] }>("/billing/plans"),
  });

  const checkoutMutation = useMutation({
    mutationFn: (planId: string) =>
      apiClient.post<{ url: string }>("/billing/checkout", { planId }),
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
    onError: () => toast.error("Failed to start checkout"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading plans…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and credits.</p>
      </div>

      {user && (
        <div className="p-4 rounded-lg border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current plan</p>
            <p className="text-2xl font-bold text-primary mt-0.5">{user.plan}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Credits remaining</p>
            <p className="text-2xl font-bold mt-0.5">{user.credits.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {data?.plans.map((plan) => {
          const isCurrent = user?.plan === plan.id;
          const isUpgrade =
            (user?.plan === "FREE" && plan.id !== "FREE") ||
            (user?.plan === "PRO" && plan.id === "TEAM");

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-lg border flex flex-col gap-4 ${
                plan.id === "PRO"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {plan.id === "PRO" && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Zap className="w-3.5 h-3.5" />
                  Most popular
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold">{plan.name}</h2>
                <div className="mt-1">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.credits.toLocaleString()} credits/month
                </p>
              </div>

              <ul className="space-y-2 flex-1">
                {(PLAN_FEATURES[plan.id] ?? []).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => isUpgrade && checkoutMutation.mutate(plan.id)}
                disabled={isCurrent || (!isUpgrade && plan.id !== "FREE") || checkoutMutation.isPending}
                className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-muted text-muted-foreground cursor-default"
                    : isUpgrade
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-default"
                }`}
              >
                {isCurrent
                  ? "Current plan"
                  : checkoutMutation.isPending
                  ? "Redirecting…"
                  : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-lg border border-border bg-card">
        <h3 className="font-semibold text-sm mb-1">Need more credits?</h3>
        <p className="text-sm text-muted-foreground">
          Credit top-ups and enterprise plans coming soon. Contact us for custom pricing.
        </p>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}
