import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CardTaskOfTheDay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes taches du jour</CardTitle>
        <CardDescription>Deadline aujourd'hui</CardDescription>

        <CardAction>
          <Button variant="ghost">
            <ArrowRight />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold text-primary">8</div>
      </CardContent>
    </Card>
  );
}
