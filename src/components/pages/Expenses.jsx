import BaseLayout from "@/components/common/BaseLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import CardLayout from "@/components/common/CardLayout";
import { formatCurrency } from "@/lib/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MotionButton from "@/components/motionUI/MotionButton";
import { ArrowBigDown, ChevronDown, EditIcon } from "lucide-react";
import DatePickerWithRange from "@/components/common/DatePickerWithRange";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateInput from "@/components/common/DateInput";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Textarea } from "@/components/ui/textarea";
import { useAcc } from "@/hooks/useAcc";
import { useTransac } from "@/hooks/useTransac";
import { toast } from "sonner";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const Expenses = () => {
  const transacForm = useForm();
  const AccountForm = useForm();
  const { register, formState, control, handleSubmit } = transacForm;
  const {
    register: accRegister,
    formState: accFormState,
    handleSubmit: accHandleSubmit,
  } = AccountForm;
  const [transacDailog, setTransacDailog] = useState(false);
  const [accDailog, setAccDailog] = useState(false);
  const [accList, setAccList] = useState(null);
  const { handleAdd, loading, apiError, apiData } = useAcc();
  const { getTranList, tranLoading, tranApiData, tranApiError } = useTransac();
  const trnasType = useWatch({
    control,
    name: "trnasType",
  });
  const handleAddTransaction = async (data) => {
    console.log("data: ", data);
  };
  const handleAddAccount = async (data) => {
    const accData = {
      accName: data.accName,
      accBalance: Number(data.accAmount),
      isActive: true,
    };
    await handleAdd(accData);
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      await getTranList();
    };
    fetchTransactions();
  }, []);
  useEffect(() => {
    if (!tranApiData) return;
    if (tranApiData.success) {
      toast.success(tranApiData.message);
      setAccList(tranApiData?.data?.accList || []);
    }
  }, [tranApiData]);
  useEffect(() => {
    if (!apiData) return;
    if (apiData.success) {
      toast.success(apiData.message);
      setAccDailog(false);
      AccountForm.reset();
    }
  }, [apiData]);
  useEffect(() => {
    if (!apiError) return;
    toast.error(apiError.message);
  }, [apiError]);
  if (loading || tranLoading) {
    return <LoadingScreen />;
  }
  return (
    <BaseLayout
      title="Expenses"
      description="Monitor your daily spending effortlessly."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-4 mb-8">
        <DropdownMenu className="col-span-1">
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="secondary"
              size="filter"
              buttonConfig="dropdown"
            >
              <span>All Types</span>
              <ChevronDown className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">Types</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu className="col-span-1">
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="secondary"
              size="filter"
              buttonConfig="dropdown"
            >
              <span>All Categories</span>
              <ChevronDown className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">Types</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu className="col-span-1">
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="secondary"
              size="filter"
              buttonConfig="dropdown"
            >
              <span>All Accounts</span>
              <ChevronDown className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">Types</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="col-span-1 md:col-span-2">
          <DatePickerWithRange />
        </div>
        <MotionButton
          variant="outline"
          size="filter"
          className="col-span-1 justify-center"
          onClick={() => {
            setAccDailog(true);
          }}
        >
          Add Account
        </MotionButton>
        <MotionButton
          variant="outline"
          size="filter"
          className="col-span-1 justify-center"
          onClick={() => {
            setTransacDailog(true);
          }}
        >
          Add Transaction
        </MotionButton>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <CardLayout className="flex flex-1 gap-6 p-0 lg:p-2.5 bg-success/10 border-success/30">
          <Item>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-success">
                Total Balance
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(78400)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardLayout>
        <CardLayout className="flex flex-1 gap-6 p-1 lg:p-2.5 bg-destructive/10 border-destructive/30">
          <Item>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-destructive">
                Total Expenses
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(32720)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardLayout>
        <CardLayout className="flex flex-1 gap-6 p-1 lg:p-2.5 bg-primary/10 border-primary/30">
          <Item>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-primary">
                Net Amount
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(45680)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardLayout>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="py-3.5 bg-muted border rounded-b-lg shadow-2xl relative z-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Dialog open={transacDailog} onOpenChange={setTransacDailog}>
        <DialogContent className="sm:max-w-[60%]">
          <form onSubmit={handleSubmit(handleAddTransaction)}>
            <DialogHeader>
              <DialogTitle>Expense Configuration</DialogTitle>
              <DialogDescription>
                You can configure you expenses here
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 p-4 max-h-[65vh] no-scrollbar overflow-y-auto">
              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  min="1"
                  autoComplete="off"
                  className="w-full sm:max-w-60"
                  aria-invalid={!!formState.errors.amount}
                  {...register("amount", {
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
                {formState.errors.amount && (
                  <FieldError errors={[formState.errors.amount]} />
                )}
              </Field>
              <Controller
                name="trnasType"
                control={control}
                rules={{
                  required: "Please Select",
                }}
                render={({ field, fieldState }) => (
                  <Field key={field.value}>
                    <FieldLabel htmlFor={field.name}>
                      Transaction Type
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
                          <SelectItem value="debit">Pay-Out</SelectItem>
                          <SelectItem value="credit">Credit-In</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
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
                name="transAcc"
                control={control}
                rules={{
                  required: "Please Select",
                }}
                render={({ field, fieldState }) => (
                  <Field key={field.value}>
                    <FieldLabel htmlFor={field.name}>Account</FieldLabel>
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
                          {accList?.map((acc) => (
                            <SelectItem
                              key={acc._id}
                              value={acc.name.toLowerCase().replace(" ", "-")}
                            >
                              {acc.name} - <span>{acc.balance}</span>
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
                name="transCategory"
                control={control}
                rules={{
                  required: "Please Select",
                }}
                render={({ field, fieldState }) => (
                  <Field key={field.value}>
                    <FieldLabel htmlFor={field.name}>
                      Transaction Category
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
                          <SelectItem value="food">food</SelectItem>
                          <SelectItem value="shopping">shopping</SelectItem>
                          <SelectItem value="travel">travel</SelectItem>
                          <SelectItem value="salary">salary</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  id="description"
                  autoComplete="off"
                  placeholder="Cheat Meal"
                  className="w-full sm:max-w-60"
                />
              </Field>
              <Controller
                name="transDate"
                control={control}
                rules={{
                  required: "Please Select",
                }}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" key={field.value}>
                    <FieldLabel htmlFor={field.name}>
                      Date of transaction
                    </FieldLabel>
                    <DateInput
                      {...field}
                      id={field.name}
                      className="sm:max-w-60 p-1"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="transPayMethod"
                control={control}
                rules={{
                  required: trnasType === "debit" ? "Please Select" : false,
                }}
                render={({ field, fieldState }) => (
                  <Field key={field.value}>
                    <FieldLabel htmlFor={field.name}>Payment Method</FieldLabel>
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
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="net-banking">
                            Net Banking
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field key="merchant" data-invalid={formState.errors.merchant}>
                <FieldLabel htmlFor="merchant">Merchant Name</FieldLabel>
                <Input
                  id="merchant"
                  autoComplete="off"
                  placeholder="Amazon"
                  className="w-full sm:max-w-60"
                  aria-invalid={!!formState.errors.merchant}
                  {...register("merchant", {
                    required:
                      trnasType === "debit"
                        ? "Merchant Name is required"
                        : false,
                  })}
                />
                {formState.errors.merchant && (
                  <FieldError errors={[formState.errors.merchant]} />
                )}
              </Field>
              <Field className="col-span-1 sm:col-span-2">
                <FieldLabel htmlFor="transNote">Add Notes</FieldLabel>
                <Textarea
                  id="transNote"
                  autoComplete="off"
                  placeholder="You can add a note related to your transaction here."
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <MotionButton type="button" variant="outline" size="lg">
                  Cancel
                </MotionButton>
              </DialogClose>
              <MotionButton type="submit" size="lg">
                Update
              </MotionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={accDailog} onOpenChange={setAccDailog}>
        <DialogContent className="sm:max-w-[60%] lg:max-w-[40%]">
          <form onSubmit={accHandleSubmit(handleAddAccount)}>
            <DialogHeader>
              <DialogTitle>Account Configuration</DialogTitle>
              <DialogDescription>
                You can add new account or modify your existing one
              </DialogDescription>
            </DialogHeader>
            <ItemGroup>
              <ItemHeader>
                <ItemTitle>Accounts List</ItemTitle>
              </ItemHeader>
              {accList?.map((acc) => (
                <Item key={acc._id} className="max-w-1/2">
                  <ItemContent>
                    <div className="flex flex-row">
                      <ItemTitle>Account Name:</ItemTitle>
                      <ItemDescription>{acc.name}</ItemDescription>
                    </div>
                    <div className="flex flex-row">
                      <ItemTitle>Account Balance:</ItemTitle>
                      <ItemDescription>{acc.balance}</ItemDescription>
                    </div>
                  </ItemContent>
                  <ItemActions>
                    <MotionButton type="button" variant="ghost">
                      <EditIcon />
                    </MotionButton>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 p-4 max-h-[65vh] no-scrollbar overflow-y-auto">
              <Field key="accName" data-invalid={accFormState.errors.accName}>
                <FieldLabel htmlFor="accName">Account Name</FieldLabel>
                <Input
                  id="accName"
                  autoComplete="off"
                  placeholder="XYZ Bank"
                  className="w-full sm:max-w-60"
                  aria-invalid={!!accFormState.errors.accName}
                  {...accRegister("accName", {
                    required: "Account Name is required",
                  })}
                />
                {accFormState.errors.accName && (
                  <FieldError errors={[accFormState.errors.accName]} />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="accAmount">Amount</FieldLabel>
                <Input
                  id="accAmount"
                  type="text"
                  inputMode="decimal"
                  min="0"
                  autoComplete="off"
                  className="w-full sm:max-w-60"
                  aria-invalid={!!accFormState.errors.accAmount}
                  {...accRegister("accAmount", {
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
                {accFormState.errors.accAmount && (
                  <FieldError errors={[accFormState.errors.accAmount]} />
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <MotionButton type="button" variant="outline" size="lg">
                  Cancel
                </MotionButton>
              </DialogClose>
              <MotionButton type="submit" size="lg">
                Add
              </MotionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
};

export default Expenses;
