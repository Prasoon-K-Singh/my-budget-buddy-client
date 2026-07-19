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
  ItemContent,
  ItemDescription,
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
import { ArrowBigDown, ChevronDown } from "lucide-react";
import DatePickerWithRange from "@/components/common/DatePickerWithRange";

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
          className="col-span-1 xl:col-start-7"
        >
          Add Transaction
        </MotionButton>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <CardLayout className="flex flex-1 gap-6 p-0 lg:p-2.5 bg-success/10 border-success/30">
          <Item>
            <ItemContent>
              <ItemTitle className="text-md md:text-xl text-success">
                Monthly Limit
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
                Monthly Expenses
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
    </BaseLayout>
  );
};

export default Expenses;
