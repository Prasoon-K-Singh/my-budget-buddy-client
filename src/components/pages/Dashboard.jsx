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
import { formatCurrency, shortAmount } from "@/lib/currency";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { ChevronRight, Receipt, Target, User, Wallet } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CHART_DYNAMIC_COLORS, LABEL_COLORS } from "@/config/colorConfig";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboard } from "@/hooks/useDashboard";
import LoadingScreen from "@/components/common/LoadingScreen";

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetDashboardOverview } = useDashboard();
  const [catOverview, setCatOverview] = useState([]);
  const [overallSpending, setOverallSpending] = useState("");
  const [transacList, setTransacList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartConfig, setChartConfig] = useState({});
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    getOverview();
  }, []);
  const getOverview = async () => {
    setLoading(true);
    const data = await handleGetDashboardOverview();
    if (!data.success) {
      toast.error(data.message || "Failed to fetch dashboard overview", {
        id: "dash-fetch-overview-error",
      });
      setLoading(false);
      return;
    }
    const categories = data?.data || [];
    setCatOverview(categories);
    setOverallSpending(data?.spending || "");
    setTransacList(data?.transaction || []);
    const chartConfig = {
      value: {
        label: "Category",
      },
    };

    categories.forEach((category, index) => {
      chartConfig[category.categoryName.replace(" ", "-")] = {
        label: category.categoryName.replace(" ", "-"),
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    const chartData = categories.map((category) => ({
      category: category.categoryName,
      value: category.expense,
      fill: `var(--color-${category.categoryName.replace(" ", "-")})`,
    }));
    setChartConfig(chartConfig);
    setChartData(chartData);
    setLoading(false);
  };
  console.log("chartConfig: ", chartConfig);
  console.log("chartData: ", chartData);
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <BaseLayout
      title="Dashboard"
      description="Get a clear view of your finances with insights and analytics."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <CardLayout className="bg-primary/10 border-primary/30">
          <Item className="flex flex-col items-start gap-4 p-5">
            <ItemTitle className="text-muted-foreground text-lg">
              Total Balance
            </ItemTitle>
            <ItemTitle className="pt-1 text-2xl text-primary">
              {formatCurrency(overallSpending?.totalBalance || 0)}
            </ItemTitle>
            <ItemTitle className="text-muted-foreground">
              Overall Account Balance
            </ItemTitle>
          </Item>
        </CardLayout>
        <CardLayout className="bg-success/10 border-success/30">
          <Item className="flex flex-col items-start gap-4 p-5">
            <ItemTitle className="text-muted-foreground text-lg">
              Total Credit
            </ItemTitle>
            <ItemTitle className="pt-1 text-2xl text-success">
              {formatCurrency(overallSpending?.currentMonth?.credit || 0)}
            </ItemTitle>
            {overallSpending?.creditChange?.direction === "increase" ? (
              <ItemTitle className="text-muted-foreground">
                <span className="text-success">
                  +{overallSpending?.creditChange?.percentage || 0}%{" "}
                </span>
                more then last month
              </ItemTitle>
            ) : overallSpending?.creditChange?.direction === "decrease" ? (
              <ItemTitle className="text-muted-foreground">
                <span className="text-destructive">
                  +{overallSpending?.creditChange?.percentage || 0}%{" "}
                </span>
                more then last month
              </ItemTitle>
            ) : null}
          </Item>
        </CardLayout>
        <CardLayout className="bg-destructive/10 border-destructive/30">
          <Item className="flex flex-col items-start gap-4 p-5">
            <ItemTitle className="text-muted-foreground text-lg">
              Total Debit
            </ItemTitle>
            <ItemTitle className="pt-1 text-2xl text-destructive">
              {formatCurrency(overallSpending?.currentMonth?.debit || 0)}
            </ItemTitle>
            {overallSpending?.creditChange?.direction === "decrease" ? (
              <ItemTitle className="text-muted-foreground">
                <span className="text-success">
                  +{overallSpending?.debitChange?.percentage || 0}%{" "}
                </span>
                more then last month
              </ItemTitle>
            ) : overallSpending?.creditChange?.direction === "increase" ? (
              <ItemTitle className="text-muted-foreground">
                <span className="text-destructive">
                  +{overallSpending?.debitChange?.percentage || 0}%{" "}
                </span>
                more then last month
              </ItemTitle>
            ) : null}
          </Item>
        </CardLayout>
        <CardLayout className="bg-ring/10 border-ring/30">
          <Item className="flex flex-col items-start gap-4 p-5">
            <ItemTitle className="text-muted-foreground text-lg">
              Most Utilized Category
            </ItemTitle>
            <ItemTitle className="pt-1 text-2xl text-ring">
              {formatCurrency(overallSpending?.mostUtilsCategory?.expense || 0)}
            </ItemTitle>
            <ItemTitle className="text-muted-foreground">
              {overallSpending?.mostUtilsCategory?.categoryName || 0}
            </ItemTitle>
          </Item>
        </CardLayout>
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
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-1">
                <p className="text-3xl font-bold">
                  {shortAmount(overallSpending?.currentMonth?.debit || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spend</p>
              </div>
            </div>
            <ScrollArea className="lg:h-90 flex flex-1">
              <ItemGroup className="flex flex-1 p-0 gap-2 my-auto">
                {catOverview.map((category, index) => (
                  <Item key={category.id}>
                    <ItemContent className="flex flex-row justify-between items-start">
                      <ItemTitle className="max-lg:max-w-30 flex-2">
                        <div
                          className={cn(
                            "w-4 h-4 flex justify-between items-center rounded-full ",
                            CHART_DYNAMIC_COLORS[
                              index % CHART_DYNAMIC_COLORS.length
                            ],
                          )}
                        ></div>
                        {category.categoryName}
                      </ItemTitle>
                      <ItemTitle className="flex-1 justify-end">
                        {category.expensePercentage}%
                      </ItemTitle>
                      <ItemTitle className="flex-1 justify-end">
                        {formatCurrency(category.expense)}
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </ScrollArea>
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
                  <MotionButton
                    onClick={() => navigate("/expenses")}
                    variant="outline"
                    size="lg"
                  >
                    View All
                  </MotionButton>
                </ItemActions>
              </ItemHeader>
            </Item>
            {transacList.length > 0 ? (
              transacList.map((transaction, index) => (
                <Item key={transaction.id} className="px-1 py-0 md:px-3">
                  <ItemContent className="flex flex-row gap-4">
                    {/* make it as common ui */}
                    <div
                      className={cn(
                        "w-8 h-8 md:w-12 md:h-12 flex justify-between items-center rounded-full ",
                        LABEL_COLORS[index % LABEL_COLORS.length].progress,
                      )}
                    >
                      <span className="flex-1 text-2xl md:text-3xl text-center font-bold">
                        {transaction?.merchantName?.charAt(0) || "M"}
                      </span>
                    </div>
                    <ItemContent className="gap-0">
                      <ItemTitle className="text:md lg:text-lg font-semibold">
                        {transaction?.merchantName || "Unknown Merchant"}
                      </ItemTitle>
                      <ItemDescription>
                        {transaction.description || "No description available"}
                      </ItemDescription>
                    </ItemContent>
                  </ItemContent>
                  <ItemContent className="gap-0 items-end">
                    <ItemTitle
                      className={cn(
                        "text:md lg:text-lg font-semibold ",
                        transaction.type === "debit"
                          ? "text-destructive"
                          : "text-success",
                      )}
                    >
                      {formatCurrency(transaction.amount, "INR")}
                    </ItemTitle>
                    <ItemDescription>
                      {format(
                        new Date(transaction.transactionDate),
                        "MMM dd, yyyy",
                      )}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))
            ) : (
              <div className="flex flex-1 justify-center p-4 text-xl">
                No Transaction found!
              </div>
            )}
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
                <FieldLabel className="text:lg lg:text-xl font-bold text-success">
                  Budget
                </FieldLabel>
                <FieldTitle className="text-muted-foreground pt-1">
                  Configure New Budget
                </FieldTitle>
                <div>
                  <MotionButton
                    onClick={() => navigate("/budgets")}
                    variant="outline"
                    size="lg"
                  >
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
                <FieldLabel className="text:lg lg:text-xl font-bold text-destructive">
                  Goals
                </FieldLabel>
                <FieldTitle className="text-muted-foreground pt-1">
                  Configure Goals
                </FieldTitle>
                <div>
                  <MotionButton
                    onClick={() => navigate("/goals")}
                    variant="outline"
                    size="lg"
                  >
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
            <div className="w-12 h-12 min-w-12 min-h-12 rounded-md bg-ring/15 flex justify-center items-center">
              <User color="var(--ring)" className="w-8 h-8" />
            </div>
            <Field>
              <FieldContent className="h-full justify-between gap-3">
                <FieldLabel className="text:lg lg:text-xl font-bold text-ring">
                  User Profile
                </FieldLabel>
                <FieldTitle className="text-muted-foreground pt-1">
                  Manage your Profile
                </FieldTitle>
                <div>
                  <MotionButton
                    onClick={() => navigate("/profile")}
                    variant="outline"
                    size="lg"
                  >
                    View Profile
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
