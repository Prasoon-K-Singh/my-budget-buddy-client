import { useEffect, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import BaseLayout from "@/components/common/BaseLayout";
import CardLayout from "@/components/common/CardLayout";
import LoadingScreen from "@/components/common/LoadingScreen";
import ComboboxCreatable from "@/components/common/ComboboxCreatable";
import MotionButton from "@/components/motionUI/MotionButton";
import { toast } from "sonner";
import { LABEL_COLORS } from "@/config/colorConfig";
import { STATUS, YES_NO_SELECT } from "@/config/config";
import { useCat } from "@/hooks/useCat";
import { cn } from "@/lib/utils";
import { formatCurrency, paiseToRupees, rupeesToPaise } from "@/lib/currency";
import { Controller, useForm } from "react-hook-form";
import { Lightbulb } from "lucide-react";
const date = new Date();

const BudgetBuilder = () => {
  const budgetForm = useForm();
  const {
    handleGetBudget,
    handleCreateCat,
    handleUpdateCat,
    handleGetCurrMonthExpenses,
    loading,
  } = useCat();
  const { register, formState, control, handleSubmit } = budgetForm;
  const [budgetDailog, setBudgetDailog] = useState(false);
  const [categoryDets, setCategoryDets] = useState([]);
  const [budgetCategory, setBudgetCategory] = useState([]);
  const [overallBudget, setOverallBudget] = useState({});
  const [payloadData, setPayloadData] = useState({});
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [disableStatus, setDisableStatus] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetchBudget();
    fetchCurrMonthExpenses();
  }, []);
  const fetchBudget = async () => {
    const data = await handleGetBudget();
    const options = data?.data?.map((item) => ({
      value: item.id,
      label: item.catName,
      catBudget: item.catBudget,
      catStatus: item.catStatus,
      catIncluded: item.catIncluded,
      isDefault: item.isDefault,
    }));
    setCategoryDets(options);
  };
  const fetchCurrMonthExpenses = async () => {
    const data = await handleGetCurrMonthExpenses();
    setBudgetCategory(data?.data || []);
    setOverallBudget(data?.overall || {});
  };
  const resetBudgetForm = () => {
    budgetForm.reset({
      catName: "",
      catBudget: "",
      catStatus: "",
      catIncluded: "",
    });
  };
  const handleBudgetDailogChange = (isOpen) => {
    setBudgetDailog(isOpen);
    if (!isOpen) {
      resetBudgetForm();
    }
  };
  const handleConfigBudget = async (data) => {
    if (data.catIncluded === "yes" && data.catStatus === "inactive") {
      budgetForm.setError("catIncluded", {
        type: "manual",
        message: "Inactive category cannot be included in budget",
      });
      return;
    }
    const name = data.catName
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const bal = rupeesToPaise(data.catBudget);
    const catData = {
      catName: payloadData?.label || name,
      catBudget: bal,
      catStatus: data.catStatus,
      catIncluded: data.catIncluded,
    };
    let result = {};
    if (isEditingCategory) {
      result = await handleUpdateCat(payloadData.value, catData);
    } else {
      result = await handleCreateCat(catData);
    }
    if (!result.success) {
      toast.error(result.message, { id: "cat-conf-error" });
      return;
    }
    toast.success(result.message, { id: "cat-conf-success" });
    setBudgetDailog(false);
    resetBudgetForm();
    fetchBudget();
    fetchCurrMonthExpenses();
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <BaseLayout title="Budget Planner" description="Plan smarter. Spend wiser.">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <CardLayout className="col-span-1 p-0 md:p-4">
          <ItemGroup>
            <Item>
              <ItemHeader className="text:lg lg:text-xl font-bold">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}{" "}
                Budget
              </ItemHeader>
            </Item>
            <Separator />
            <Item>
              <Field>
                <FieldLabel>
                  <span className="flex flex-row">Overall Progress</span>
                  <span className="ml-auto">
                    {overallBudget.totalExpensePercentage > 100
                      ? 100
                      : overallBudget.totalExpensePercentage || 0}
                    %
                  </span>
                </FieldLabel>
                <Progress
                  value={
                    overallBudget.totalExpensePercentage > 100
                      ? 100
                      : overallBudget.totalExpensePercentage || 0
                  }
                />
              </Field>
            </Item>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription>Total Budget</ItemDescription>
                <ItemTitle>
                  {formatCurrency(overallBudget.totalBudget || 0)}
                </ItemTitle>
              </ItemContent>
            </Item>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription>Total Spend</ItemDescription>
                <ItemTitle>
                  {formatCurrency(overallBudget.totalSpend || 0)}
                </ItemTitle>
              </ItemContent>
            </Item>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription>Remaining</ItemDescription>
                <ItemTitle>
                  {formatCurrency(overallBudget.totalRemaining || 0)}
                </ItemTitle>
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
                    onClick={() => {
                      setBudgetDailog(true);
                    }}
                  >
                    Add Budget
                  </MotionButton>
                </ItemActions>
              </ItemHeader>
            </Item>
            <ScrollArea className="lg:h-91 pr-4">
              {(budgetCategory.length > 0 &&
                budgetCategory.map((category, index) => (
                  <Item key={category.categoryId}>
                    {/* make it as common ui */}
                    <div
                      className={cn(
                        "w-8 h-8 md:w-12 md:h-12 flex justify-between items-center rounded-full ",
                        LABEL_COLORS[index % LABEL_COLORS.length].progress,
                      )}
                    >
                      <span className="flex-1 text-2xl md:text-3xl text-center font-bold">
                        {category?.categoryName?.charAt(0) || "C"}
                      </span>
                    </div>
                    <ItemContent className="flex-row items-center">
                      <Field>
                        <FieldLabel>
                          <span className="flex flex-1 flex-row text-sm md:text-lg">
                            {category?.categoryName || "Category Name"}
                          </span>
                          <span className="hidden md:block mr-20">
                            {formatCurrency(category?.expense || 0, "INR")} of{" "}
                            {formatCurrency(category?.budget || 0, "INR")}
                          </span>
                        </FieldLabel>
                        <Progress
                          className="md:h-2"
                          value={
                            mounted
                              ? category?.expensePercentage > 100
                                ? 100
                                : category?.expensePercentage || 0
                              : 0
                          }
                          trackColor={
                            LABEL_COLORS[index % LABEL_COLORS.length].track
                          }
                          color={
                            LABEL_COLORS[index % LABEL_COLORS.length].progress
                          }
                        />
                      </Field>
                    </ItemContent>
                    <ItemContent>
                      <FieldLabel className="text-md md:text-2xl">
                        {category?.expensePercentage > 100
                          ? 100
                          : category?.expensePercentage || 0}
                        %
                      </FieldLabel>
                    </ItemContent>
                  </Item>
                ))) || (
                <Item>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text:md lg:text-lg font-semibold text-muted-foreground">
                      No budget categories found.
                    </ItemTitle>
                  </ItemContent>
                </Item>
              )}
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
      <Dialog open={budgetDailog} onOpenChange={handleBudgetDailogChange}>
        <DialogContent className="sm:max-w-[80%] xl:max-w-[40%]">
          <form onSubmit={handleSubmit(handleConfigBudget)}>
            <DialogHeader>
              <DialogTitle className="text-sm md:text-xl">
                Budget Configuration
              </DialogTitle>
              <DialogDescription>
                You can add new budget category or modify your existing one
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 p-4 pb-20 max-h-[65vh] no-scrollbar overflow-y-auto gap-0 gap-x-5 gap-y-12">
              <Controller
                name="catName"
                control={control}
                rules={{
                  required: "Please Select",
                }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                    <ComboboxCreatable
                      name={field.name}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        const category = categoryDets.find(
                          (item) => item.value === value,
                        );
                        if (category) {
                          if (category.isDefault) {
                            setDisableStatus(true);
                          } else {
                            setDisableStatus(false);
                          }
                          setIsEditingCategory(true);
                          setPayloadData(category);
                          budgetForm.reset({
                            catName: value || "",
                            catBudget: category.catBudget
                              ? paiseToRupees(category.catBudget)
                              : "",
                            catStatus: category?.catStatus || "",
                            catIncluded: category?.catIncluded || "",
                          });
                        } else {
                          setDisableStatus(false);
                          setIsEditingCategory(false);
                          setPayloadData({});
                          budgetForm.reset({
                            catName: value || "",
                            catBudget: "",
                            catStatus: "",
                            catIncluded: "",
                          });
                        }
                      }}
                      onBlur={field.onBlur}
                      className="w-full sm:max-w-60"
                      options={categoryDets}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <FieldLabel htmlFor="catBudget">Budget</FieldLabel>
                <Input
                  id="catBudget"
                  type="text"
                  inputMode="decimal"
                  min="0"
                  placeholder="Set Budget"
                  autoComplete="off"
                  className="w-full sm:max-w-60"
                  aria-invalid={!!formState.errors.catBudget}
                  {...register("catBudget", {
                    required: "Amount is required",
                    validate: (value) => {
                      if (Number(value) == 0) {
                        return "Amount must be greater then 0";
                      }
                      return true;
                    },
                    onChange: (e) => {
                      const value = e.target.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.target.value = value.slice(0, -1);
                      }
                    },
                  })}
                />
                {formState.errors.catBudget && (
                  <FieldError errors={[formState.errors.catBudget]} />
                )}
              </Field>
              <Controller
                name="catStatus"
                control={control}
                rules={{
                  required: "Please Select",
                }}
                render={({ field, fieldState }) => (
                  <Field key={field.value}>
                    <FieldLabel htmlFor={field.name}>
                      Category Status
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      disabled={disableStatus}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full sm:max-w-60"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {Object.entries(STATUS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="catIncluded"
                control={control}
                rules={{
                  required: "Please Select",
                }}
                render={({ field, fieldState }) => (
                  <Field key={field.value}>
                    <FieldLabel htmlFor={field.name}>
                      Include in Budget
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full sm:max-w-60"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {Object.entries(YES_NO_SELECT).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <MotionButton type="button" variant="outline" size="lg">
                  Cancel
                </MotionButton>
              </DialogClose>
              <MotionButton type="submit" size="lg">
                Save
              </MotionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
};

export default BudgetBuilder;
