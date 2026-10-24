import { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  Check,
  MoreVertical,
  Plus,
  Receipt,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Item, ItemTitle } from "@/components/ui/item";
import { Card, CardContent } from "@/components/ui/card";
import BaseLayout from "@/components/common/BaseLayout";
import CardLayout from "@/components/common/CardLayout";
import AddBillsDialog from "@/components/common/AddBills";
import LoadingScreen from "@/components/common/LoadingScreen";
import MotionButton from "@/components/motionUI/MotionButton";
import { toast } from "sonner";
import { Calendar, Calendar1, ChartBar, Clock } from "lucide-react";
import { LABEL_COLORS } from "@/config/colorConfig";
import { useBill } from "@/hooks/useBill";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";

const GoalTracker = () => {
  const [payments, setPayments] = useState([]);
  const [markingPaid, setMarkingPaid] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [delPaymentId, setDelPaymentId] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [billDltConf, setBillDltConf] = useState(false);

  const { getBills, delBill, markBillPaid, billLoading } = useBill();

  const fetchPayments = async () => {
    const { data } = await getBills();
    setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const monthlyAmount = useMemo(() => {
    return payments.reduce((total, payment) => {
      switch (payment.frequency) {
        case "monthly":
          return total + payment.amount;

        case "quarterly":
          return total + payment.amount / 3;

        case "half-yearly":
          return total + payment.amount / 6;

        case "yearly":
          return total + payment.amount / 12;

        default:
          return total;
      }
    }, 0);
  }, [payments]);

  const dueThisMonth = useMemo(() => {
    const now = new Date();
    return payments
      .filter((payment) => {
        const date = new Date(payment.nextDueDate);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce(
        (result, payment) => ({
          amount: result.amount + payment.amount,
          count: result.count + 1,
        }),
        { amount: 0, count: 0 },
      );
  }, [payments]);

  const upcomingPayments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next30Days = new Date(today);
    next30Days.setDate(today.getDate() + 30);

    return payments
      .filter((payment) => {
        const dueDate = new Date(payment.nextDueDate);
        return dueDate >= today && dueDate < next30Days;
      })
      .sort(
        (a, b) =>
          new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime(),
      );
  }, [payments]);

  const upcomingSummary = useMemo(() => {
    return {
      count: upcomingPayments.length,
      amount: upcomingPayments.reduce(
        (total, payment) => total + payment.amount,
        0,
      ),
    };
  }, [upcomingPayments]);

  const handleMarkPaid = async (payment) => {
    const result = await markBillPaid(payment._id);
    if (!result.success) {
      toast.error(result.message, { id: "mark-bill-paid-error" });
      return;
    }
    toast.success(result.message, { id: "mark-bill-paid-success" });
    fetchPayments();
  };
  const handleDelete = async () => {
    const result = await delBill(delPaymentId);
    if (!result.success) {
      toast.error(result.message, { id: "del-bill-error" });
      return;
    }
    toast.success(result.message, { id: "del-bill-success" });
    setBillDltConf(false);
    setDelPaymentId(null);
    fetchPayments();
  };
  const handleCreated = (payment) => {
    setShowAddDialog(false);
    setPaymentId(null);
    fetchPayments();
  };
  const handleAddBillCancel = () => {
    setPaymentId(null);
  };
  const handleBillDltAlert = (isOpen) => {
    setBillDltConf(isOpen);
    if (!isOpen) {
      setDelPaymentId(null);
    }
  };
  const getDaysLeft = (timestamp) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(timestamp);
    dueDate.setHours(0, 0, 0, 0);
    return Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  };
  const getDaysText = (timestamp) => {
    const days = getDaysLeft(timestamp);
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    }
    if (days === 0) {
      return "Due today";
    }
    if (days === 1) {
      return "1 day left";
    }
    return `${days} days left`;
  };
  const SummaryCard = ({ icon: Icon, title, value, description, color }) => {
    return (
      <CardLayout className="flex flex-row gap-6 p-5">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-${color}/10 text-${color}`}
        >
          <Icon className="h-10 w-10" />
        </div>
        <div className="min-w-0">
          <Item className="flex flex-col items-start gap-2 p-0">
            <ItemTitle className="text-muted-foreground text-lg">
              {title}
            </ItemTitle>
            <ItemTitle className="pb-1 text-2xl">
              {!isNaN(value) ? formatCurrency(value) : value}
            </ItemTitle>
            <ItemTitle className={`text-${color}`}>{description}</ItemTitle>
          </Item>
        </div>
      </CardLayout>
    );
  };
  const UpcomingPayments = ({ payments, onMarkPaid, markingPaid }) => {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Payments</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Your next recurring payments
            </p>
          </div>
        </div>
        <div className="divide-y">
          {payments.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No upcoming payments.
            </div>
          ) : (
            payments.map((payment, index) => (
              <UpcomingPaymentRow
                key={payment._id}
                payment={payment}
                loading={markingPaid === payment._id}
                onMarkPaid={onMarkPaid}
                index={index}
              />
            ))
          )}
        </div>
      </Card>
    );
  };
  const UpcomingPaymentRow = ({ payment, loading, onMarkPaid, index }) => {
    const daysLeft = getDaysLeft(payment.nextDueDate);
    const isUrgent = daysLeft <= 7;

    if (loading || billLoading) {
      return <LoadingScreen />;
    }
    return (
      <div className="flex items-center gap-3 px-5 py-3.5">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold ",
            LABEL_COLORS[index % LABEL_COLORS.length].progress,
          )}
        >
          <span className="flex-1 text-2xl text-center font-bold">
            {payment.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{payment.name}</p>
          <Badge
            variant="secondary"
            className={cn(
              "mt-1 px-2 py-0 text-[10px] capitalize",
              payment.type === "bill"
                ? " bg-destructive/15 text-destructive"
                : " bg-chart-1/15 text-chart-1",
            )}
          >
            {payment.type}
          </Badge>
        </div>
        <div className="hidden w-24 shrink-0 sm:block">
          <p className="text-sm font-medium">
            {formatCurrency(payment.amount)}
          </p>
          <p className="text-[11px] capitalize text-muted-foreground">
            {payment.frequency}
          </p>
        </div>
        <div className="hidden w-32 shrink-0 sm:block">
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{format(new Date(payment.nextDueDate), "MMM dd, yyyy")}</span>
          </div>
          <p
            className={`mt-1 text-[11px] ${
              isUrgent ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {getDaysText(payment.nextDueDate)}
          </p>
        </div>
        <div className="sm:hidden">
          <p className="text-xs font-medium">
            {formatCurrency(payment.amount)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {getDaysText(payment.nextDueDate)}
          </p>
        </div>
        <MotionButton
          size="sm"
          className="shrink-0"
          disabled={loading}
          onClick={() => onMarkPaid(payment)}
        >
          <Check className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {loading ? "Updating..." : "Mark Paid"}
          </span>
          <span className="sm:hidden">{loading ? "..." : "Paid"}</span>
        </MotionButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MotionButton
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
            </MotionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setShowAddDialog(true);
                setPaymentId(payment._id);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setBillDltConf(true);
                setDelPaymentId(payment._id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  const QuickAdd = ({ onAdd }) => {
    return (
      <Card>
        <CardContent className="p-5">
          <h2 className="text-base font-semibold">Quick Add</h2>
          <div className="mt-4 rounded-xl bg-primary/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Add a new bill or subscription
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  It only takes a few seconds.
                </p>
              </div>
            </div>
            <MotionButton className="mt-4 w-full" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </MotionButton>
          </div>
        </CardContent>
      </Card>
    );
  };
  const PaymentTypes = ({ payments }) => {
    const bills = payments.filter((payment) => payment.type === "bill");
    const subscriptions = payments.filter(
      (payment) => payment.type === "subscription",
    );
    const billAmount = bills.reduce(
      (total, payment) => total + payment.amount,
      0,
    );
    const subscriptionAmount = subscriptions.reduce(
      (total, payment) => total + payment.amount,
      0,
    );

    return (
      <Card>
        <CardContent className="p-5">
          <h2 className="text-base font-semibold">Payment Types</h2>
          <div className="mt-3 divide-y">
            <PaymentTypeRow
              title="Bills"
              count={bills.length}
              amount={billAmount}
              icon={Receipt}
              color="destructive"
            />
            <PaymentTypeRow
              title="Subscriptions"
              count={subscriptions.length}
              amount={subscriptionAmount}
              icon={WalletCards}
              color="chart-1"
            />
          </div>
        </CardContent>
      </Card>
    );
  };
  const PaymentTypeRow = ({ title, count, amount, icon: Icon, color }) => {
    return (
      <div className="flex items-center gap-3 py-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-${color}/10 text-${color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">
            {count} {count === 1 ? "payment" : "payments"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
        </div>
      </div>
    );
  };
  return (
    <BaseLayout
      title="Bills & Subscriptions"
      description="Track your recurring payments and never miss a due date."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard
          icon={Calendar}
          title="Monthly Payments"
          value={monthlyAmount}
          description={`${payments.length} payments`}
          color="primary"
        />
        <SummaryCard
          icon={Calendar1}
          title="Due this month"
          value={dueThisMonth.amount}
          description={`${dueThisMonth.count} payments`}
          color="success"
        />
        <SummaryCard
          icon={Clock}
          title={`${upcomingSummary.count} Upcoming Payments`}
          value={`${upcomingSummary.amount.toFixed(2)}`}
          description="Next 30 days"
          color="chart-4"
        />
        <SummaryCard
          icon={ChartBar}
          title="Annual Commitments"
          value={monthlyAmount * 12}
          description="Base on current payments"
          color="chart-1"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <UpcomingPayments
          payments={payments}
          onMarkPaid={handleMarkPaid}
          markingPaid={markingPaid}
        />
        <div className="space-y-5">
          <QuickAdd
            onAdd={() => {
              setShowAddDialog(true);
              setPaymentId(null);
            }}
          />
          <PaymentTypes payments={payments} />
        </div>
      </div>

      <AddBillsDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCreated={handleCreated}
        paymentId={paymentId}
        onCancel={handleAddBillCancel}
      />
      <AlertDialog open={billDltConf} onOpenChange={handleBillDltAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              selected bill/subscription from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </BaseLayout>
  );
};

export default GoalTracker;
