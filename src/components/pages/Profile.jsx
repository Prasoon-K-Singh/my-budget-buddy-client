import { useEffect, useRef, useState } from "react";
import BaseLayout from "@/components/common/BaseLayout";
import MotionButton from "@/components/motionUI/MotionButton";
import CardLayout from "@/components/common/CardLayout";
import DateInput from "@/components/common/DateInput";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { Controller, useForm } from "react-hook-form";
import { UserRound, IndianRupee, DollarSign } from "lucide-react";
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
  FieldError,
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
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import PasswordInput from "@/components/common/PasswordInput";
import LoadingScreen from "@/components/common/LoadingScreen";

const Profile = () => {
  const imgUploadInputRef = useRef(null);
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      occupation: "",
      dob: {},
      gender: "",
      currency: "",
    },
  });
  const { handleSubmit, control, reset } = form;
  const passwordForm = useForm();

  const {
    data,
    apiError,
    loading,
    getUserInfo,
    updateUser,
    updatePassword,
    uploadProfileImg,
  } = useUser();

  const [isEditable, setIsEditable] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      await getUserInfo();
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const info = data?.user || null;
    if (info) {
      reset({
        firstname: info?.name?.firstname || "",
        lastname: info?.name?.lastname || "",
        email: info?.email || "",
        username: info?.username || "",
        occupation: info?.occupation || "",
        dob: new Date(info?.dob || {}),
        gender: info?.gender || "",
        currency: info?.currency || "",
      });
      toast.success(data.message);
    }
  }, [data, reset]);
  useEffect(() => {
    if (!apiError) return;

    switch (apiError.code) {
      case "INVALID_CURRENT_PASSWORD":
        passwordForm.setError("currPass", {
          type: "server",
          message: apiError.message,
        });
        break;
      case "PASSWORD_REUSE":
        passwordForm.setError("newPassword", {
          type: "server",
          message: apiError.message,
        });
        break;
      default:
        toast.error(apiError.message);
    }
  }, [apiError]);
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUserUpdate = async (data) => {
    const updatedInfo = {
      name: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      username: data.username,
      occupation: data.occupation,
      dob: Date.parse(data.dob),
      gender: data.gender,
      currency: data.currency,
    };
    await updateUser(updatedInfo);
    setIsEditable(false);
  };
  const handlePasswordUpdate = async (data) => {
    try {
      const passwordReset = {
        oldPassword: data.currPass,
        newPassword: data.newPassword,
      };
      await updatePassword(passwordReset);
      setPasswordDialogOpen(false);
      passwordForm.reset();
      toast.success("Password updated successfully");
    } catch (err) {}
  };
  const handleDailogChange = (isOpen) => {
    setPasswordDialogOpen(isOpen);

    if (!isOpen) {
      passwordForm.reset();
    }
  };
  const handleUploadButton = () => {
    imgUploadInputRef.current?.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };
  const handleUploadCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  const handleProfileImgSave = async () => {
    if (!selectedFile) return;
    try {
      const formdata = new FormData();
      formdata.append("profile-img", selectedFile);
      await uploadProfileImg(formdata);
      setSelectedFile(null);
      toast.success("Profile picture updated successfully");
    } catch (err) {}
  };
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <BaseLayout
      title="Profile"
      description="Manage your personal details and account preferences."
    >
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:px-5">
        <div className="col-span-1 flex flex-col items-center">
          <Avatar className="w-60 h-60 mt-4 lg:mt-8 mb-8">
            <AvatarImage src={previewUrl || data?.user?.profileImg} />
            <AvatarFallback>
              <UserRound className="h-45 w-45" />
            </AvatarFallback>
          </Avatar>
          <Input
            hidden
            type="file"
            ref={imgUploadInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.webp"
          />
          <div className="flex gap-4">
            <MotionButton
              variant="outline"
              size="lg"
              onClick={handleUploadButton}
            >
              Change Photo
            </MotionButton>
            {selectedFile ? (
              <>
                <MotionButton
                  variant="outline"
                  size="lg"
                  onClick={handleProfileImgSave}
                >
                  Update
                </MotionButton>
                <MotionButton
                  variant="outline"
                  size="lg"
                  onClick={handleUploadCancel}
                >
                  Cancel
                </MotionButton>
              </>
            ) : null}
          </div>
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
          <form onSubmit={handleSubmit(handleUserUpdate)}>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-x-8 gap-y-5 px-7">
              <Controller
                name="firstname"
                control={control}
                rules={{
                  required: "First name is required",
                }}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      First Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      disabled={!isEditable}
                      className="max-w-60"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastname"
                control={control}
                rules={{
                  required: "Last name is required",
                }}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      Last Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      disabled={!isEditable}
                      className="max-w-60"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      Email <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      disabled={!isEditable}
                      className="max-w-60"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="username"
                control={control}
                rules={{
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message:
                      "Username can only contain letters, numbers, hyphens (-), and underscores (_)",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      Username <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="off"
                      disabled={!isEditable}
                      className="max-w-60"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="occupation"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name}>Occupation</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      disabled={!isEditable}
                      className="max-w-60"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="dob"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>
                    <DateInput
                      {...field}
                      id={field.name}
                      disabled={!isEditable}
                      className="max-w-60 p-1"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field, fieldState }) => (
                  <Field key={field.value} data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isEditable}
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full max-w-60"
                        aria-invalid={fieldState.invalid}
                      >
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="currency"
                control={control}
                render={({ field, fieldState }) => (
                  <Field key={field.value} data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Currency</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isEditable}
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full max-w-60"
                        aria-invalid={fieldState.invalid}
                      >
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="flex justify-end gap-4 p-4">
              {isEditable ? (
                <>
                  <MotionButton
                    size="lg"
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditable(false)}
                  >
                    Cancel
                  </MotionButton>
                  <MotionButton type="submit" size="lg">
                    Update
                  </MotionButton>
                </>
              ) : (
                <MotionButton
                  size="lg"
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditable(true)}
                >
                  Edit
                </MotionButton>
              )}
            </div>
          </form>
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
          <Dialog open={passwordDialogOpen} onOpenChange={handleDailogChange}>
            <DialogTrigger asChild>
              <MotionButton className="ml-auto" variant="outline" size="lg">
                Change Password
              </MotionButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new secure
                    password.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="py-4">
                  <Input
                    type="email"
                    autoComplete="username"
                    value={data?.info?.email || ""}
                    readOnly
                    hidden
                  />
                  <Field>
                    <Label htmlFor="currPass">Current Password</Label>
                    <PasswordInput
                      id="currPass"
                      autoComplete="current-password"
                      {...passwordForm.register("currPass", {
                        required: "Current Password is required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                          message:
                            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
                        },
                      })}
                    />
                    {passwordForm.formState.errors.currPass && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currPass.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="newPassword">New Password</Label>
                    <PasswordInput
                      id="newPassword"
                      autoComplete="new-password"
                      {...passwordForm.register("newPassword", {
                        required: "New Password is required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                          message:
                            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
                        },
                      })}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="confNewPass">Confirm New Password</Label>
                    <PasswordInput
                      id="confNewPass"
                      autoComplete="new-password"
                      {...passwordForm.register("confNewPass", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === passwordForm.getValues("newPassword") ||
                          "Passwords do not match",
                      })}
                    />
                    {passwordForm.formState.errors.confNewPass && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confNewPass.message}
                      </p>
                    )}
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <MotionButton type="button" variant="outline" size="lg">
                      Cancel
                    </MotionButton>
                  </DialogClose>
                  <MotionButton
                    type="submit"
                    size="lg"
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <>
                        <Spinner /> Updating
                      </>
                    ) : (
                      "Update"
                    )}
                  </MotionButton>
                </DialogFooter>
              </form>
            </DialogContent>
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
