import BaseLayout from "@/components/common/BaseLayout";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CardLayout from "@/components/common/CardLayout";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EllipsisVertical, Plane } from "lucide-react";
import MotionButton from "@/components/motionUI/MotionButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatCurrency } from "@/lib/currency";
const GoalTracker = () => {
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    update();

    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);
  return (
    <BaseLayout
      title="Savings Goals"
      description="Save consistently. Achieve confidently."
    >
      <div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pl-1 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <CardLayout className="p-4 shadow-none">
                    <CardContent className="flex flex-row gap-4 px-0">
                      <Avatar className="w-10 h-10 md:w-14 md:h-14">
                        <AvatarFallback className="bg-blue-500">
                          <Plane className="h-6 w-6 md:w-10 md:h-10 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <Field>
                        <FieldContent className="h-full justify-between gap-2">
                          <FieldLabel className="text:lg lg:text-xl font-bold">
                            Goa Trip
                          </FieldLabel>
                          <Badge>Travel</Badge>
                        </FieldContent>
                      </Field>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <MotionButton variant="ghost" buttonConfig="dropdown">
                            <EllipsisVertical className="h-4 w-4" />
                          </MotionButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center justify-between gap-4">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center justify-between gap-4">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                    <Field className="w-full max-w-sm py-8">
                      <FieldLabel>
                        <span className="flex flex-row">
                          {formatCurrency(24500, "INR")} of{" "}
                          {formatCurrency(40000, "INR")}
                        </span>
                        <span className="ml-auto text-primary">61%</span>
                      </FieldLabel>
                      <Progress value={61} id="progress-upload" />
                    </Field>
                    <Separator />
                    <Field orientation="horizontal" className="py-4">
                      <FieldLabel>Target Date</FieldLabel>
                      <FieldDescription>Dec 31, 2026</FieldDescription>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel>Monthly Contribution</FieldLabel>
                      <FieldDescription>
                        {formatCurrency(5000)}
                      </FieldDescription>
                    </Field>
                  </CardLayout>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" /> */}
          <div className="flex justify-center gap-2 mt-4">
            {canScrollPrev && <CarouselPrevious className="relative" />}
            {canScrollNext && <CarouselNext className="relative" />}
          </div>
        </Carousel>
      </div>
      <CardLayout className="mt-8 p-4">
        <Field orientation="horizontal">
          <FieldLabel className="text:lg lg:text-xl font-bold">
            Completed Goals
          </FieldLabel>
          <MotionButton
            variant="outline"
            size="lg"
            onClick={() => setLoading(true)}
          >
            View All
          </MotionButton>
        </Field>
        <CardLayout className="flex flex-col gap-6 mt-4">
          <Item className="gap-4">
            <Avatar className="w-10 h-10 md:w-14 md:h-14 mb-auto">
              <AvatarFallback className="bg-blue-500">
                <Plane className="h-6 w-6 md:w-10 md:h-10 text-white" />
              </AvatarFallback>
            </Avatar>
            <ItemContent>
              <ItemTitle className="text:lg lg:text-xl font-bold">
                iPhone 16
              </ItemTitle>
              <ItemDescription>Completed on Mar 10, 2026</ItemDescription>
            </ItemContent>
            <ItemContent className="mt-auto">
              <FieldLabel className="text-success text:md lg:text-lg">
                {formatCurrency(80000)}
              </FieldLabel>
            </ItemContent>
          </Item>
        </CardLayout>
        {loading ? (
          <div className="flex justify-center pt-8">
            <Spinner className="size-8" />
          </div>
        ) : null}
      </CardLayout>
    </BaseLayout>
  );
};

export default GoalTracker;
