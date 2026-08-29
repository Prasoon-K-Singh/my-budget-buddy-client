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
import { ACC_LIST_COLORS } from "@/config/colorConfig";
import { LIST_LIMIT, PAY_METHOD, TRANS_TYPE } from "@/config/config";
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
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
const today = new Date();

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
  const [warningAlert, setWarningAlert] = useState(false);
  const [delAccName, setDelAccName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [transacList, setTransacList] = useState([]);
  const [accList, setAccList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [balList, setBalList] = useState({});
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });
  const [accountFilter, setAccountFilter] = useState("all-acc");
  const [categoryFilter, setCategoryFilter] = useState("all-cat");
  const [methodFilter, setMethodFilter] = useState("all-method");
  const [typeFilter, setTypeFilter] = useState("all-type");
  const [refreshKey, setRefreshKey] = useState(0);
  const { handleAdd, handleDelete, loading } = useAcc();
  const { addTran, getTranList, delTran, editTran, tranLoading } = useTransac();

  // Helpers
  const refreshData = async () => {
    const payload = {
      page,
      limit: LIST_LIMIT,
      fromDate: dateRange?.from?.getTime(),
      toDate: dateRange?.to?.getTime(),
      ...(accountFilter !== "all-acc" && { account: accountFilter._id }),
      ...(categoryFilter !== "all-cat" && { category: categoryFilter._id }),
      ...(methodFilter !== "all-method" && { method: methodFilter }),
      ...(typeFilter !== "all-type" && { type: typeFilter }),
    };
    const result = await getTranList(payload);
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
      pagination = {},
    } = result.data || {};
    setTransacList(transacList);
    setAccList(accList);
    setCatList(catList);
    setBalList(balList);
    setPagination(pagination);
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
  const resetAllFilter = () => {
    setDateRange({
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: today,
    });
    setAccountFilter("all-acc");
    setCategoryFilter("all-cat");
    setMethodFilter("all-method");
    setTypeFilter("all-type");
  };

  // Effects
  useEffect(() => {
    refreshData();
  }, [page, refreshKey]);

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
    handleResetFilter();
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
    handleResetFilter();
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
    handleResetFilter();
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
    handleResetFilter();
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
  const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };
  const handleResetFilter = () => {
    resetAllFilter();
    if (page !== 1) {
      setPage(1);
    } else {
      setRefreshKey((prev) => prev + 1);
    }
  };
  const handleSearch = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      setRefreshKey((prev) => prev + 1);
    }
  };
  if (loading || tranLoading) {
    return <LoadingScreen />;
  }
  return (
    <BaseLayout
      title="Expenses"
      description="Monitor your daily spending effortlessly."
    >
      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        <DropdownMenu className="col-span-1">
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="secondary"
              size="filter"
              buttonConfig="dropdown"
            >
              <span>
                {accountFilter === "all-acc"
                  ? "All Account"
                  : accountFilter.name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              value="all-acc"
              onClick={() => setAccountFilter("all-acc")}
              className="flex items-center justify-between gap-4"
            >
              All Account
            </DropdownMenuItem>
            {accList?.map((acc) => (
              <DropdownMenuItem
                key={acc._id}
                value={acc._id}
                onClick={() => setAccountFilter(acc)}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">{acc.name}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu className="col-span-1">
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="secondary"
              size="filter"
              buttonConfig="dropdown"
            >
              <span>
                {categoryFilter === "all-cat"
                  ? "All Category"
                  : categoryFilter.name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              value="all-cat"
              onClick={() => setCategoryFilter("all-cat")}
              className="flex items-center justify-between gap-4"
            >
              All Category
            </DropdownMenuItem>
            {catList?.map((cat) => (
              <DropdownMenuItem
                key={cat._id}
                value={cat._id}
                onClick={() => setCategoryFilter(cat)}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">{cat.name}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu className="col-span-1">
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="secondary"
              size="filter"
              buttonConfig="dropdown"
            >
              <span>
                {methodFilter === "all-method"
                  ? "All Method"
                  : PAY_METHOD[methodFilter]}
              </span>
              <ChevronDown className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              value="all-method"
              onClick={() => setMethodFilter("all-method")}
              className="flex items-center justify-between gap-4"
            >
              All Method
            </DropdownMenuItem>
            {Object.entries(PAY_METHOD).map(([value, label]) => (
              <DropdownMenuItem
                key={value}
                value={value}
                onClick={() => setMethodFilter(value)}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">{label}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu className="col-span-1">
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="secondary"
              size="filter"
              buttonConfig="dropdown"
            >
              <span>
                {typeFilter === "all-type"
                  ? "All Type"
                  : TRANS_TYPE[typeFilter]}
              </span>
              <ChevronDown className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              value="all-type"
              onClick={() => setTypeFilter("all-type")}
              className="flex items-center justify-between gap-4"
            >
              All Type
            </DropdownMenuItem>
            {Object.entries(TRANS_TYPE).map(([value, label]) => (
              <DropdownMenuItem
                key={value}
                value={value}
                onClick={() => setTypeFilter(value)}
                className="flex items-center justify-between gap-4"
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="col-span-1 md:col-span-4 lg:col-span-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <MotionButton
          variant="outline"
          size="filter"
          className="col-span-1 justify-center"
          onClick={() => {
            handleResetFilter();
          }}
        >
          Reset
        </MotionButton>
        <MotionButton
          variant="outline"
          size="filter"
          className="col-span-1 justify-center"
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </MotionButton>
        <MotionButton
          variant="outline"
          size="filter"
          className="col-span-1 justify-center"
          onClick={() => {
            setAccDailog(true);
          }}
        >
          Account Config
        </MotionButton>
        <MotionButton
          variant="outline"
          size="filter"
          className="col-span-1 justify-center"
          onClick={() => {
            accList.length === 0
              ? setWarningAlert(true)
              : setTransacDailog(true);
          }}
        >
          Add Transaction
        </MotionButton>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <CardLayout className="flex flex-1 gap-6 p-1 lg:p-2.5 bg-primary/10 border-primary/30">
          <Item className="gap-x-4">
            <div className="md:hidden xl:flex w-16 h-16 min-w-16 min-h-16 rounded-md bg-primary/15 flex justify-center items-center">
              <Wallet color="var(--primary)" className="w-12 h-12" />
            </div>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-primary">
                Total Balance
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(balList?.totalBalance || 0)}
              </ItemDescription>
              <ItemDescription className="text-sm">
                Overall account balance
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardLayout>
        <CardLayout className="flex flex-1 gap-6 p-0 lg:p-2.5 bg-success/10 border-success/30">
          <Item className="gap-x-4">
            <div className="md:hidden xl:flex w-16 h-16 min-w-16 min-h-16 rounded-md bg-success/15 flex justify-center items-center">
              <TrendingUp color="var(--success)" className="w-12 h-12" />
            </div>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-success">
                Total Credit
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(balList?.totalCredit || 0)}
              </ItemDescription>
              <ItemDescription className="text-sm">
                Total credit in selected period
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardLayout>
        <CardLayout className="flex flex-1 gap-6 p-1 lg:p-2.5 bg-destructive/10 border-destructive/30">
          <Item className="gap-x-4">
            <div className="md:hidden xl:flex w-16 h-16 min-w-16 min-h-16 rounded-md bg-destructive/15 flex justify-center items-center">
              <TrendingDown color="var(--destructive)" className="w-12 h-12" />
            </div>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-destructive">
                Total Debit
              </ItemTitle>
              <ItemDescription className="text-xl md:text-3xl font-bold">
                {formatCurrency(balList?.totalDebit || 0)}
              </ItemDescription>
              <ItemDescription className="text-sm">
                Total debit in selected period
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
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Type</TableHead>
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
                <TableCell>{transac?.accountId?.name || "-"}</TableCell>
                <TableCell>{transac?.categoryId?.name || "-"}</TableCell>
                <TableCell>
                  {transac?.paymentMethod
                    ? PAY_METHOD[transac.paymentMethod]
                    : "-"}
                </TableCell>
                <TableCell
                  className={
                    transac.type === "debit"
                      ? "text-destructive"
                      : "text-success"
                  }
                >
                  {transac.type ? TRANS_TYPE[transac.type] : "-"}
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
                    <EditIcon color="var(--primary)" />
                  </MotionButton>
                  <MotionButton
                    onClick={() => handleTranDelete(transac)}
                    type="button"
                    variant="ghost"
                    className="p-0"
                  >
                    <Trash2Icon color="var(--destructive)" />
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
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
              className={
                page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>
          {getPageNumbers(page, pagination.totalPages).map(
            (pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={pageNumber === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (page < pagination.totalPages) {
                  setPage(page + 1);
                }
              }}
              className={
                page === pagination.totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
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
                          {Object.entries(TRANS_TYPE).map(([value, label]) => (
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
                          {Object.entries(PAY_METHOD).map(([value, label]) => (
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
                  const listColor =
                    ACC_LIST_COLORS[index % ACC_LIST_COLORS.length];
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
                            onClick={() => handleAccEdit(acc)}
                            type="button"
                            variant="ghost"
                            className="p-0"
                          >
                            <EditIcon color="var(--primary)" />
                          </MotionButton>
                          <MotionButton
                            onClick={() => handleAccDelete(acc)}
                            type="button"
                            variant="ghost"
                            className="p-0"
                          >
                            <Trash2Icon color="var(--destructive)" />
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
      <AlertDialog open={warningAlert} onOpenChange={setWarningAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please Configure Account First!</AlertDialogTitle>
            <AlertDialogDescription>
              Please add atleast one account before adding any transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setAccDailog(true)}>
              Account Config
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </BaseLayout>
  );
};

export default Expenses;
