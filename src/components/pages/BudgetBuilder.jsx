import BaseLayout from "@/components/common/BaseLayout";
import CardLayout from "@/components/common/CardLayout";
import MotionButton from "@/components/motionUI/MotionButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/currency";
import { Lightbulb, Plane } from "lucide-react";

const BudgetBuilder = () => {
  return (
    <BaseLayout title="Budget Planner" description="Plan smarter. Spend wiser.">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <CardLayout className="col-span-1 p-0 md:p-4">
          <ItemGroup>
            <Item>
              <ItemHeader className="text:lg lg:text-xl font-bold">
                May 2024 Budget
              </ItemHeader>
            </Item>
            <Separator />
            <Item>
              <Field>
                <FieldLabel>
                  <span className="flex flex-row">Overall Progress</span>
                  <span className="ml-auto">61%</span>
                </FieldLabel>
                <Progress value={61} />
              </Field>
            </Item>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription>Total Budget</ItemDescription>
                <ItemTitle>{formatCurrency(50000)}</ItemTitle>
              </ItemContent>
            </Item>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription>Spend</ItemDescription>
                <ItemTitle>{formatCurrency(31240)}</ItemTitle>
              </ItemContent>
            </Item>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription>Remaining</ItemDescription>
                <ItemTitle>{formatCurrency(18760)}</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardLayout>
        <CardLayout className="col-span-2 p-0 md:p-4">
          <ItemGroup>
            <Item>
              <ItemHeader>
                <ItemTitle className="text:lg lg:text-xl font-bold">
                  Category Budget
                </ItemTitle>
                <ItemActions>
                  <MotionButton
                    variant="outline"
                    size="lg"
                    onClick={() => setLoading(true)}
                  >
                    Add Budget
                  </MotionButton>
                </ItemActions>
              </ItemHeader>
            </Item>
            <ScrollArea className="lg:h-91 pr-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <Item key={index}>
                  <Avatar className="w-10 h-10 md:w-14 md:h-14">
                    <AvatarFallback className="bg-blue-500">
                      <Plane className="h-6 w-6 md:w-10 md:h-10 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <ItemContent className="flex-row items-center">
                    <Field>
                      <FieldLabel>
                        <span className="flex flex-1 flex-row text-sm md:text-lg">
                          Food
                        </span>
                        <span className="hidden md:block mr-20">
                          {formatCurrency(2000, "INR")} of{" "}
                          {formatCurrency(4000, "INR")}
                        </span>
                      </FieldLabel>
                      <Progress className="md:h-2" value={50} />
                    </Field>
                  </ItemContent>
                  <ItemContent>
                    <FieldLabel className="text-md md:text-2xl">50%</FieldLabel>
                  </ItemContent>
                </Item>
              ))}
            </ScrollArea>
          </ItemGroup>
        </CardLayout>
      </div>
      <CardLayout className="mt-8 p-0 md:p-4">
        <Item>
          <ItemContent className="gap-0">
            <ItemTitle className="text-md md:text-lg font-bold mb-4">
              Tips
            </ItemTitle>
            <ItemDescription className="mx-2.5">
              You've spent 15% more on Food compared to last month.
            </ItemDescription>
            <MotionButton variant="link" size="lg" className="w-fit">
              View Insights
            </MotionButton>
          </ItemContent>
          <Lightbulb className="h-20 w-20 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
        </Item>
      </CardLayout>
    </BaseLayout>
  );
};

export default BudgetBuilder;
