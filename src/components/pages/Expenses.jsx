import { useEffect, useState } from "react";
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
  ItemTitle,
} from "@/components/ui/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import DateInput from "@/components/common/DateInput";
import CardLayout from "@/components/common/CardLayout";
import BaseLayout from "@/components/common/BaseLayout";
import LoadingScreen from "@/components/common/LoadingScreen";
import DatePickerWithRange from "@/components/common/DatePickerWithRange";
import MotionButton from "@/components/motionUI/MotionButton";
import { toast } from "sonner";
import { AccListColors } from "@/config/colorConfig";
import { payMethod, transType } from "@/config/config";
import { useAcc } from "@/hooks/useAcc";
import { useTransac } from "@/hooks/useTransac";
import { formatTransactionNo } from "@/lib/utils";
import { formatCurrency, paiseToRupees, rupeesToPaise } from "@/lib/currency";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  ChevronDown,
  CloudAlertIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";

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
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingTransac, setIsEditingTransac] = useState(false);
  const [accDltConf, setAccDltConf] = useState(false);
  const [delAccName, setDelAccName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [transacList, setTransacList] = useState([]);
  const [accList, setAccList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [balList, setBalList] = useState({});
  const { handleAdd, handleDelete, loading } = useAcc();
  const { addTran, getTranList, delTran, editTran, tranLoading } = useTransac();

  // Helpers
  const refreshData = async () => {
    const result = await getTranList();
    if (!result.success) {
      toast.error(result.message || "Failed to fetch transactions", {
        id: "fetch-tran-error",
      });

      return;
    }
    const {
      transacList = [],
      accList = [],
      catList = [],
      balList = {},
    } = result.data || {};
    setTransacList(transacList);
    setAccList(accList);
    setCatList(catList);
    setBalList(balList);
  };
  const resetTransacForm = () => {
    transacForm.reset({
      transDate: "",
      amount: "",
      transType: "",
      transAcc: "",
      transCategory: "",
      transPayMethod: "",
      merchant: "",
      transDesc: "",
      transNote: "",
    });
    setIsEditingTransac(false);
    setSelectedId("");
  };
  const resetAccountForm = () => {
    AccountForm.reset({
      accName: "",
      accAmount: "",
    });
    setIsEditingAccount(false);
    setSelectedId("");
  };
  const resetDeleteAccount = () => {
    setDelAccName("");
    setSelectedId("");
  };

  // Effects
  useEffect(() => {
    refreshData();
  }, []);

  // Handlers
  const handleAddTransaction = async (data) => {
    let result;
    const bal = rupeesToPaise(data.amount);
    const date = data.transDate ? data.transDate.getTime() : null;
    const tranDet = {
      transDate: date,
      transAmount: bal,
      transType: data.transType,
      transAccount: data.transAcc,
      transCategory: data.transCategory,
      transMethod: data.transPayMethod,
      transMerchant: data.merchant,
      transDesc: data.transDesc,
      transNotes: data.transNote,
    };
    if (isEditingTransac) {
      result = await editTran(selectedId, tranDet);
    } else {
      result = await addTran(tranDet);
    }
    if (!result.success) {
      toast.error(result.message, { id: "add-tran-error" });
      return;
    }
    toast.success(result.message, { id: "add-tran-success" });
    setTransacDailog(false);
    resetTransacForm();
    await refreshData();
  };
  const handleTranDel = async () => {
    const result = await delTran(selectedId);
    if (!result.success) {
      toast.error(result.message, { id: "del-acc-error" });
      return;
    }
    toast.success(result.message, { id: "del-acc-success" });
    setAccDltConf(false);
    resetDeleteAccount();
    await refreshData();
  };
  const handleAddAccount = async (data) => {
    const bal = rupeesToPaise(data.accAmount);
    const accData = {
      accName: data.accName,
      accBalance: bal,
      isActive: true,
    };
    if (isEditingAccount) {
      accData.accId = selectedId;
    }
    const result = await handleAdd(accData);
    if (!result.success) {
      toast.error(result.message, { id: "add-acc-error" });
      return;
    }
    toast.success(result.message, { id: "add-acc-success" });
    setAccDailog(false);
    resetAccountForm();
    await refreshData();
  };
  const handleAccEdit = (data) => {
    const bal = paiseToRupees(data.balance);
    AccountForm.reset({
      accName: data.name,
      accAmount: bal,
    });
    setIsEditingAccount(true);
    setSelectedId(data._id);
  };
  const handleTransacEdit = (data) => {
    setTransacDailog(true);
    setIsEditingTransac(true);
    setSelectedId(data._id);
    transacForm.reset({
      transDate: new Date(data?.transactionDate || {}),
      amount: data?.amount / 100 || 0,
      transType: data?.type || "",
      transAcc: data?.accountId?._id || "",
      transCategory: data?.categoryId?._id || "",
      transPayMethod: data?.paymentMethod || "",
      merchant: data?.merchantName || "",
      transDesc: data?.description || "",
      transNote: data?.notes || "",
    });
  };
  const handleAccDel = async () => {
    const result = await handleDelete(selectedId);
    if (!result.success) {
      toast.error(result.message, { id: "del-tran-error" });
      return;
    }
    toast.success(result.message, { id: "del-tran-success" });
    setAccDailog(false);
    setAccDltConf(false);
    resetAccountForm();
    resetDeleteAccount();
    await refreshData();
  };
  const handleTranDailogChange = (isOpen) => {
    setTransacDailog(isOpen);
    if (!isOpen) {
      resetTransacForm();
    }
  };
  const handleAccDailogChange = (isOpen) => {
    setAccDailog(isOpen);
    if (!isOpen) {
      resetAccountForm();
    }
  };
  const handleAccDltAlert = (isOpen) => {
    setAccDltConf(isOpen);
    if (!isOpen) {
      resetDeleteAccount();
    }
  };
  const handleAccDelete = (data) => {
    setDelAccName(data.name);
    setSelectedId(data._id);
    setAccDltConf(true);
  };
  const handleTranDelete = (data) => {
    setSelectedId(data._id);
    setAccDltConf(true);
  };
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
        <CardLayout className="flex flex-1 gap-6 p-1 lg:p-2.5 bg-primary/10 border-primary/30">
          <Item>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-primary">
                Total Balance
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(balList?.totalBalance || 0)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardLayout>
        <CardLayout className="flex flex-1 gap-6 p-0 lg:p-2.5 bg-success/10 border-success/30">
          <Item>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-success">
                Total Earnings
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(balList?.totalCredit || 0)}
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
                {formatCurrency(balList?.totalDebit || 0)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardLayout>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transacList.length > 0 ? (
            transacList.map((transac) => (
              <TableRow key={transac._id}>
                <TableCell>
                  {formatTransactionNo(transac.transactionNo)}
                </TableCell>
                <TableCell>
                  {format(new Date(transac.transactionDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {transac?.amount
                    ? formatCurrency(transac.amount)
                    : formatCurrency(0)}
                </TableCell>
                <TableCell>
                  {transac.type ? transType[transac.type] : "-"}
                </TableCell>
                <TableCell>{transac?.accountId?.name || "-"}</TableCell>
                <TableCell>{transac?.categoryId?.name || "-"}</TableCell>
                <TableCell>
                  {transac?.paymentMethod
                    ? payMethod[transac.paymentMethod]
                    : "-"}
                </TableCell>
                <TableCell>{transac?.merchantName || "-"}</TableCell>
                <TableCell>{transac?.description || "-"}</TableCell>
                <TableCell className="max-w-50 overflow-hidden text-ellipsis">
                  {transac?.notes || "-"}
                </TableCell>
                <TableCell className="flex justify-around">
                  <MotionButton
                    onClick={() => handleTransacEdit(transac)}
                    type="button"
                    variant="ghost"
                    className="p-0"
                  >
                    <EditIcon />
                  </MotionButton>
                  <MotionButton
                    onClick={() => handleTranDelete(transac)}
                    type="button"
                    variant="ghost"
                    className="p-0"
                  >
                    <Trash2Icon />
                  </MotionButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11}>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CloudAlertIcon />
                    </EmptyMedia>
                  </EmptyHeader>
                  <EmptyContent>
                    <EmptyTitle>No Transaction found</EmptyTitle>
                    <EmptyDescription>
                      Add tranasaction to get started
                    </EmptyDescription>
                  </EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          )}
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
      <Dialog open={transacDailog} onOpenChange={handleTranDailogChange}>
        <DialogContent className="sm:max-w-[60%] xl:max-w-[40%]">
          <form onSubmit={handleSubmit(handleAddTransaction)}>
            <DialogHeader>
              <DialogTitle>Expense Configuration</DialogTitle>
              <DialogDescription>
                You can configure you expenses here
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 p-4 max-h-[65vh] no-scrollbar overflow-y-auto">
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
                      maxDate={new Date()}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  min="1"
                  placeholder="Amount"
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
                name="transType"
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
                          {Object.entries(transType).map(([value, label]) => (
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
                            <SelectItem key={acc._id} value={acc._id}>
                              {acc.name}
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
                          {catList?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
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
                name="transPayMethod"
                control={control}
                rules={{
                  required: "Please Select",
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
                          {Object.entries(payMethod).map(([value, label]) => (
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
              <Field key="merchant" data-invalid={formState.errors.merchant}>
                <FieldLabel htmlFor="merchant">Merchant Name</FieldLabel>
                <Input
                  id="merchant"
                  autoComplete="off"
                  placeholder="Amazon"
                  className="w-full sm:max-w-60"
                  aria-invalid={!!formState.errors.merchant}
                  {...register("merchant", {
                    required: "Merchant Name is required",
                    validate: (value) =>
                      value.trim() !== "" || "Please enter valid name",
                  })}
                />
                {formState.errors.merchant && (
                  <FieldError errors={[formState.errors.merchant]} />
                )}
              </Field>
              <Field key="transDesc">
                <FieldLabel htmlFor="transDesc">Description</FieldLabel>
                <Input
                  id="transDesc"
                  autoComplete="off"
                  placeholder="Description"
                  className="w-full sm:max-w-60"
                  {...register("transDesc")}
                />
              </Field>
              <Field key="transNote" className="col-span-1 sm:col-span-2">
                <FieldLabel htmlFor="transNote">Add Notes</FieldLabel>
                <Textarea
                  id="transNote"
                  autoComplete="off"
                  {...register("transNote")}
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
                {isEditingTransac ? "Update" : "Add"}
              </MotionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={accDailog} onOpenChange={handleAccDailogChange}>
        <DialogContent className="sm:max-w-[60%] xl:max-w-[40%]">
          <form onSubmit={accHandleSubmit(handleAddAccount)}>
            <DialogHeader>
              <DialogTitle className="text-sm md:text-xl">
                Account Configuration
              </DialogTitle>
              <DialogDescription>
                You can add new account or modify your existing one
              </DialogDescription>
            </DialogHeader>
            <div className="text-xl md:text-xl font-bold mt-2">
              Account List
            </div>
            {accList.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-4 p-4 max-h-[30vh] overflow-y-auto">
                {accList?.map((acc, index) => {
                  const listColor = AccListColors[index % AccListColors.length];
                  return (
                    <CardLayout
                      key={acc._id}
                      className={`p-2 ${listColor.bg} ${listColor.border}`}
                    >
                      <Item className="p-0 items-start">
                        <ItemContent>
                          <ItemTitle className={`text-lg ${listColor.text}`}>
                            Account Overview
                          </ItemTitle>
                          <ItemTitle className="text-md">{acc.name}</ItemTitle>
                          <ItemDescription className="text-md">
                            {formatCurrency(acc.balance)}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <MotionButton
                            onClick={() => handleAccDelete(acc)}
                            type="button"
                            variant="ghost"
                            className="p-0"
                          >
                            <Trash2Icon />
                          </MotionButton>
                          <MotionButton
                            onClick={() => handleAccEdit(acc)}
                            type="button"
                            variant="ghost"
                            className="p-0"
                          >
                            <EditIcon />
                          </MotionButton>
                        </ItemActions>
                      </Item>
                    </CardLayout>
                  );
                })}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CloudAlertIcon />
                  </EmptyMedia>
                </EmptyHeader>
                <EmptyContent>
                  <EmptyTitle>No Account found</EmptyTitle>
                  <EmptyDescription>
                    Add Account to get started
                  </EmptyDescription>
                </EmptyContent>
              </Empty>
            )}
            <Separator />
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
                  placeholder="Initial Balance"
                  autoComplete="off"
                  disabled={isEditingAccount}
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
                {isEditingAccount ? <>Update</> : <>Add</>}
              </MotionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={accDltConf} onOpenChange={handleAccDltAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {delAccName ? `${delAccName} account` : "selected transaction"}{" "}
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={delAccName ? handleAccDel : handleTranDel}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </BaseLayout>
  );
};

export default Expenses;
