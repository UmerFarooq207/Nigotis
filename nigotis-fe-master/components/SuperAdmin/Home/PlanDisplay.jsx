import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Rocket, Cog } from "lucide-react";

const planIcons = {
  Basic: { name: "Basic", icon: Users, color: "bg-blue-500" },
  Premium: { name: "Premium", icon: Zap, color: "bg-yellow-500" },
  Advance: { name: "Advance", icon: Rocket, color: "bg-purple-500" },
  Custom: { name: "Custom", icon: Cog, color: "bg-green-500" },
};

export default function PlanDisplay({ plans }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((planName, index) => {
        const plan = planIcons[planName] || {
          name: planName,
          icon: Users,
          color: "bg-gray-500",
        };
        const Icon = plan.icon;

        return (
          <Card key={index} className="overflow-hidden">
            <div className={`${plan.color} h-2`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{plan.name}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Plan {index + 1}</Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
