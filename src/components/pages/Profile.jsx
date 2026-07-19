import { useState } from "react";
import BaseLayout from "@/components/common/BaseLayout";
import {
  UserRound,
  Edit,
  CheckSquare,
  CircleDollarSign,
  IndianRupee,
  BadgeIndianRupee,
  LucideIndianRupee,
  DollarSign,
} from "lucide-react";
import MotionButton from "@/components/motionUI/MotionButton";
import CardLayout from "@/components/common/CardLayout";
import DateInput from "@/components/common/DateInput";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [date, setDate] = useState();
  return (
    <BaseLayout
      title="Profile"
      description="Manage your personal details and account preferences."
    >
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:px-5">
        <div className="col-span-1 flex flex-col items-center">
          <Avatar className="w-60 h-60 mt-4 lg:mt-8 mb-8">
            <AvatarFallback>
              <UserRound className="h-45 w-45" />
            </AvatarFallback>
          </Avatar>
          <MotionButton variant="outline" size="lg">
            Change Photo
          </MotionButton>
        </div>
        <CardLayout className="col-span-2">
          <Field orientation="horizontal" className="p-4">
            <FieldContent>
              <FieldLabel className="text-lg md:text-xl font-bold">
                Personal Details
              </FieldLabel>
              <FieldDescription>Manage your details.</FieldDescription>
            </FieldContent>
          </Field>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-x-8 px-4">
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">First Name</ItemTitle>
                <ItemDescription className="flex flex-row p-1">
                  <Input
                    value={"Prasoon"}
                    className="max-w-60"
                    disabled={!isEditable}
                  />
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">Last Name</ItemTitle>
                <ItemDescription className="flex flex-row p-1">
                  <Input
                    value={"Kumar Singh"}
                    className="max-w-60"
                    disabled={!isEditable}
                  />
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">Email</ItemTitle>
                <ItemDescription className="flex flex-row p-1">
                  <Input
                    value={"prasoon@gmail.com"}
                    className="max-w-60"
                    disabled={!isEditable}
                  />
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">Username</ItemTitle>
                <ItemDescription className="flex flex-row p-1">
                  <Input
                    value={"prasoon-k-Singh"}
                    className="max-w-60"
                    disabled={!isEditable}
                  />
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">Occupation</ItemTitle>
                <ItemDescription className="flex flex-row p-1">
                  <Input
                    value={"Occupation"}
                    className="max-w-60"
                    disabled={!isEditable}
                  />
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">Date of Birth</ItemTitle>
                <DateInput
                  className="max-w-60 p-1"
                  value={date}
                  onChange={setDate}
                  disabled={!isEditable}
                />
              </ItemContent>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">Gender</ItemTitle>
                <ItemDescription className="flex flex-row p-1">
                  <Select className="w-full max-w-60" disabled={!isEditable}>
                    <SelectTrigger className="w-full max-w-60">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle className="pl-2">Currency</ItemTitle>
                <ItemDescription className="flex flex-row p-1">
                  <Select className="w-full max-w-60" disabled={!isEditable}>
                    <SelectTrigger className="w-full max-w-60">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectItem value="inr">
                          <IndianRupee /> INR
                        </SelectItem>
                        <SelectItem value="dollar">
                          <DollarSign /> DOLLAR
                        </SelectItem>
                        <SelectLabel className="mt-2 text-muted-foreground">
                          More currencies coming soon...
                        </SelectLabel>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>
          <div className="flex justify-end gap-4 p-4">
            {isEditable ? (
              <>
                <MotionButton
                  variant="outline"
                  size="lg"
                  onClick={() => setIsEditable(false)}
                >
                  Cancel
                </MotionButton>
                <MotionButton
                  type="submit"
                  size="lg"
                  onClick={() => setIsEditable(false)}
                >
                  Update
                </MotionButton>
              </>
            ) : (
              <MotionButton
                variant="outline"
                size="lg"
                onClick={() => setIsEditable(true)}
              >
                Edit
              </MotionButton>
            )}
          </div>
        </CardLayout>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 pt-8 md:px-5 gap-8">
        <CardLayout className="col-span-1 p-4">
          <Field orientation="horizontal" className="pb-4">
            <FieldContent>
              <FieldLabel className="text-lg md:text-xl font-bold">
                Account Security
              </FieldLabel>
              <FieldDescription>
                Change your password and keep your account secure.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Dialog>
            <form className="flex">
              <DialogTrigger asChild>
                <MotionButton className="ml-auto" variant="outline" size="lg">
                  Change Password
                </MotionButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new secure
                    password.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="currPass">Current Password</Label>
                    <Input id="currPass" type="password" />
                  </Field>
                  <Field>
                    <Label htmlFor="newPass">New Password</Label>
                    <Input id="newPass" type="password" />
                  </Field>
                  <Field>
                    <Label htmlFor="confNewPass">Confirm New Password</Label>
                    <Input id="confNewPass" type="password" />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <MotionButton variant="outline" size="lg">
                      Cancel
                    </MotionButton>
                  </DialogClose>
                  <MotionButton type="submit" size="lg">
                    Save changes
                  </MotionButton>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </CardLayout>
        <CardLayout className="col-span-1 p-4">
          <Field orientation="horizontal" className="pb-4">
            <FieldContent>
              <FieldLabel className="text-lg md:text-xl font-bold">
                Prefrences
              </FieldLabel>
              <FieldDescription>Manage your app prefrences.</FieldDescription>
            </FieldContent>
          </Field>
          <FieldGroup className="flex-row max-w-sm pl-2">
            <FieldLabel>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Enable Notifications</FieldTitle>
                </FieldContent>
                <Switch id="switch-share" />
              </Field>
            </FieldLabel>
          </FieldGroup>
        </CardLayout>
      </div>
    </BaseLayout>
  );
};

export default Profile;
