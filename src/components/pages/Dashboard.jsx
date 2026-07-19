import BaseLayout from "@/components/common/BaseLayout";
import CardLayout from "@/components/common/CardLayout";
import MotionButton from "@/components/motionUI/MotionButton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Pie, PieChart } from "recharts";
import { formatCurrency } from "@/lib/currency";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  ChevronRight,
  CircleSmall,
  Dot,
  Megaphone,
  Receipt,
  Target,
  Wallet,
  Wallet2,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";

const chartConfig = {
  value: {
    label: "Category",
  },
  Food: {
    label: "Food",
    color: "var(--chart-1)",
  },
  Travel: {
    label: "Travel",
    color: "var(--chart-2)",
  },
  Shopping: {
    label: "Shopping",
    color: "var(--chart-3)",
  },
  Bills: {
    label: "Bills",
    color: "var(--chart-4)",
  },
};
const chartData = [
  {
    category: "Food",
    value: 4500,
    fill: "var(--color-Food)",
  },
  {
    category: "Travel",
    value: 3200,
    fill: "var(--color-Travel)",
  },
  {
    category: "Shopping",
    value: 2100,
    fill: "var(--color-Shopping)",
  },
  {
    category: "Bills",
    value: 1800,
    fill: "var(--color-Bills)",
  },
];

const Dashboard = () => {
  return (
    <BaseLayout
      title="Dashboard"
      description="Get a clear view of your finances with insights and analytics."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardLayout key={index}>
            <Item className="flex flex-col items-start gap-4 p-5">
              <ItemTitle className="text-muted-foreground text-lg">
                Total Balance
              </ItemTitle>
              <ItemTitle className="pt-1 text-2xl">
                {formatCurrency(45680)}
              </ItemTitle>
              <ItemTitle className="text-muted-foreground">
                <span className="text-success">+12.5% </span>more then last
                month
              </ItemTitle>
            </Item>
          </CardLayout>
        ))}
      </div>
      <div className="flex flex-col xl:grid xl:grid-cols-5 gap-8 my-8">
        <CardLayout className="col-span-3">
          <div className="py-2 px-2 md:py-6.5 md:px-7">
            <FieldTitle className="text:lg lg:text-xl font-bold">
              Spending Overview
            </FieldTitle>
          </div>
          <div className="flex flex-col md:flex-row h-full min-h-75 xl:h-[80%] px-2 md:px-7 gap-8">
            <div className="relative max-md:h-75 w-full min-w-60 md:w-[40%] md:min-w-75">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent indicator="dot" hideLabel={false} />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="category"
                    innerRadius={80}
                    outerRadius={120}
                  />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold">₹11.6K</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
            <ItemGroup className="flex flex-1 p-0 gap-0 my-auto">
              {Array.from({ length: 6 }).map((_, index) => (
                <Item key={index}>
                  <ItemContent className="flex flex-row justify-between items-start">
                    <ItemTitle className="max-lg:max-w-30">
                      <CircleSmall
                        color="hsl(199 89% 48%)"
                        fill="hsl(199 89% 48%)"
                        className="h-6 w-6"
                      />
                      Food and Dining
                    </ItemTitle>
                    <ItemTitle>35%</ItemTitle>
                    <ItemTitle>{formatCurrency(11450)}</ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </div>
        </CardLayout>
        <CardLayout className="col-span-2">
          <ItemGroup className="p-1 md:p-4">
            <Item className="pb-4.5">
              <ItemHeader>
                <ItemTitle className="text:lg lg:text-xl font-bold">
                  Recent transaction
                </ItemTitle>
                <ItemActions>
                  <MotionButton variant="outline" size="lg">
                    View All
                  </MotionButton>
                </ItemActions>
              </ItemHeader>
            </Item>
            {Array.from({ length: 5 }).map((_, index) => (
              <Item key={index} className="px-1 py-0 md:px-3">
                <ItemContent className="flex flex-row gap-4">
                  {/* make it as common ui */}
                  <div className="w-8 h-8 md:w-12 md:h-12 flex justify-between items-center bg-chart-1/30 rounded-full">
                    <span className="flex-1 text-2xl md:text-3xl text-center font-bold">
                      Z
                    </span>
                  </div>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text:md lg:text-lg font-semibold">
                      Zomato
                    </ItemTitle>
                    <ItemDescription>Food & Dining</ItemDescription>
                  </ItemContent>
                </ItemContent>
                <ItemContent className="gap-0">
                  <ItemTitle className="text:md lg:text-lg font-semibold text-destructive">
                    {formatCurrency(-500, "INR")}
                  </ItemTitle>
                  <ItemDescription>May 11 2026</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </CardLayout>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CardLayout>
          <CardContent className="flex flex-row gap-6 px-6 py-2">
            <div className="w-12 h-12 min-w-12 min-h-12 rounded-md bg-success/15 flex justify-center items-center">
              <Wallet color="var(--success)" className="w-8 h-8" />
            </div>
            <Field>
              <FieldContent className="h-full justify-between gap-3">
                <FieldLabel className="text:lg lg:text-xl font-bold">
                  Budget
                </FieldLabel>
                <FieldTitle className="text-muted-foreground pt-1">
                  3 Over Budget this month
                </FieldTitle>
                <div>
                  <MotionButton variant="outline" size="lg">
                    View Budget
                  </MotionButton>
                </div>
              </FieldContent>
            </Field>
            <ChevronRight className="w-8 h-8" />
          </CardContent>
        </CardLayout>
        <CardLayout>
          <CardContent className="flex flex-row gap-6 px-6 py-2">
            <div className="w-12 h-12 min-w-12 min-h-12 rounded-md bg-destructive/15 flex justify-center items-center">
              <Target color="var(--destructive)" className="w-8 h-8" />
            </div>
            <Field>
              <FieldContent className="h-full justify-between gap-3">
                <FieldLabel className="text:lg lg:text-xl font-bold">
                  Goals
                </FieldLabel>
                <FieldTitle className="text-muted-foreground pt-1">
                  2 Goals in-Progress
                </FieldTitle>
                <div>
                  <MotionButton variant="outline" size="lg">
                    View Goals
                  </MotionButton>
                </div>
              </FieldContent>
            </Field>
            <ChevronRight className="w-8 h-8" />
          </CardContent>
        </CardLayout>
        <CardLayout>
          <CardContent className="flex flex-row gap-6 px-6 py-2">
            <div className="w-12 h-12 min-w-12 min-h-12 rounded-md bg-chart-1/15 flex justify-center items-center">
              <Receipt color="var(--chart-1)" className="w-8 h-8" />
            </div>
            <Field>
              <FieldContent className="h-full justify-between gap-3">
                <FieldLabel className="text:lg lg:text-xl font-bold">
                  Bills
                </FieldLabel>
                <FieldTitle className="text-muted-foreground pt-1">
                  2 upcoming Bills Due
                </FieldTitle>
                <div>
                  <MotionButton variant="outline" size="lg">
                    View Bills
                  </MotionButton>
                </div>
              </FieldContent>
            </Field>
            <ChevronRight className="w-8 h-8" />
          </CardContent>
        </CardLayout>
      </div>
    </BaseLayout>
  );
};
export default Dashboard;
