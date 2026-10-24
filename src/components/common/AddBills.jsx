import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import DateInput from "@/components/common/DateInput";
import MotionButton from "@/components/motionUI/MotionButton";
import { toast } from "sonner";
import { BILL_TYPE, DURATION_FREQUENCY } from "@/config/config";
import { useBill } from "@/hooks/useBill";
import { rupeesToPaise } from "@/lib/currency";
import { Controller, useForm } from "react-hook-form";

const AddBillsDialog = ({
  open,
  onOpenChange,
  onCreated,
  paymentId,
  onCancel,
}) => {
  const form = useForm();
  const { register, formState, control, handleSubmit } = form;

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createBill, getBillById, editBill, billLoading } = useBill();

  useEffect(() => {
    if (paymentId) {
      setIsEditMode(true);
      const fetchBill = async () => {
        const bill = await getBillById(paymentId);
        if (bill) {
          form.setValue("billName", bill.data.name);
          form.setValue("amount", bill.data.amount / 100);
          form.setValue("billType", bill.data.type);
          form.setValue("billFreq", bill.data.frequency);
          form.setValue("billDate", new Date(bill.data.nextDueDate));
        }
      };
      fetchBill();
    }
  }, [paymentId]);

  const handlePaymentSubmit = async (values) => {
    setLoading(true);
    const bal = rupeesToPaise(values.amount);
    const payload = {
      name: values.billName.trim(),
      amount: bal,
      type: values.billType,
      frequency: values.billFreq,
      nextDueDate: values.billDate.getTime(),
    };
    let result;
    if (isEditMode) {
      result = await editBill(paymentId, payload);
    } else {
      result = await createBill(payload);
    }
    if (!result.success) {
      toast.error(result.message, { id: "add-bill-error" });
      return;
    }
    toast.success(result.message, { id: "add-bill-success" });
    onCreated();
    form.reset();
    setIsEditMode(false);
    setLoading(false);
    onOpenChange(false);
  };
  const handleOpenChange = (value) => {
    if (loading) return;
    onOpenChange(value);
    if (!value) {
      form.reset();
      setIsEditMode(false);
      onCancel();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[60%] xl:max-w-[40%]">
        <form onSubmit={handleSubmit(handlePaymentSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Payment" : "Add Payment"}
            </DialogTitle>
            <DialogDescription>
              Add a bill or subscription to track its upcoming payment.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 p-4 max-h-[65vh] no-scrollbar overflow-y-auto">
            <Field key="billName" data-invalid={formState.errors.billName}>
              <FieldLabel htmlFor="billName">Name</FieldLabel>
              <Input
                id="billName"
                autoComplete="off"
                placeholder="Name"
                className="w-full sm:max-w-60"
                aria-invalid={!!formState.errors.billName}
                {...register("billName", {
                  required: "Name is required",
                })}
              />
              {formState.errors.billName && (
                <FieldError errors={[formState.errors.billName]} />
              )}
            </Field>
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
              name="billType"
              control={control}
              rules={{
                required: "Please Select",
              }}
              render={({ field, fieldState }) => (
                <Field key={field.value}>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
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
                        {Object.entries(BILL_TYPE).map(([value, label]) => (
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
              name="billFreq"
              control={control}
              rules={{
                required: "Please Select",
              }}
              render={({ field, fieldState }) => (
                <Field key={field.value}>
                  <FieldLabel htmlFor={field.name}>Frequency</FieldLabel>
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
                        {Object.entries(DURATION_FREQUENCY).map(
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
            <Controller
              name="billDate"
              control={control}
              rules={{
                required: "Please Select",
              }}
              render={({ field, fieldState }) => (
                <Field className="gap-2" key={field.value}>
                  <FieldLabel htmlFor={field.name}>Next Due Date</FieldLabel>
                  <DateInput
                    {...field}
                    id={field.name}
                    className="sm:max-w-60 p-1"
                    minDate={new Date()}
                    aria-invalid={fieldState.invalid}
                  />
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
            <MotionButton size="lg" type="submit" disabled={loading}>
              {isEditMode ? "Update Payment" : "Add Payment"}
            </MotionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBillsDialog;
