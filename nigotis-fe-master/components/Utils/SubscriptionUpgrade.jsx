"use client";

import { Crown, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SubscriptionUpgrade({
  featureName = "this feature",
  domain = process.env.NEXT_PUBLIC_DOMAIN || "nigotis.com",
  onDismiss,
  className = "",
}) {
  const pricingUrl = `https://${domain}/pricing`;

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center space-y-4 pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-navy to-primary-teal rounded-full flex items-center justify-center">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-navy to-primary-teal bg-clip-text text-transparent">
            Upgrade to Pro
          </CardTitle>
          <CardDescription className="text-base mt-2">
            You've reached the limit of your Free Trial. Upgrade to continue
            using {featureName} and unlock all premium features.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-prifrom-primary-navy" />
            What you'll get with Pro:
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-prifrom-primary-navy rounded-full" />
              Unlimited access to all features
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-prifrom-primary-navy rounded-full" />
              Priority customer support
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-prifrom-primary-navy rounded-full" />
              Advanced analytics and insights
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-prifrom-primary-navy rounded-full" />
              No usage limits
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-primary-navy to-primary-teal hover:from-primary-navy hover:to-primary-teal"
          >
            <Link
              href={pricingUrl}
              className="flex items-center justify-center gap-2"
            >
              View Pricing Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          {onDismiss && (
            <Button variant="outline" onClick={onDismiss} className="w-full">
              Maybe Later
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Start your subscription today and get instant access to all premium
            features.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
