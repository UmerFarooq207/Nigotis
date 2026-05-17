import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function TeamMemberCard({ member }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.title}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <p>
            <strong>Role:</strong> {member.role}
          </p>
          <p>
            <strong>Position:</strong> {member.position}
          </p>
          <p className="mt-4">{member.about}</p>
        </div>
      </CardContent>
    </Card>
  );
}
