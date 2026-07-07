import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import MotionButton from "@/components/motionUI/MotionButton";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";

function SignUp() {
  const { handleRegister } = useAuth();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const handleUserRegistration = async (data) => {
    const signupInfo = {
      name: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      username: data.username,
      password: data.password,
    };
    await handleRegister(signupInfo);
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome to My Budget Buddy</CardTitle>
        <CardDescription>
          Enter your details below to start your journey with us
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleUserRegistration)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  type="text"
                  {...register("firstname", {
                    required: "First name is required",
                  })}
                />
                {errors.firstname && (
                  <p className="text-sm text-destructive">
                    {errors.firstname.message}
                  </p>
                )}
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  {...register("lastname", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastname && (
                  <p className="text-sm text-destructive">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register("username", {
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
                })}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                    message:
                      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2 pb-4">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <MotionButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> registering
              </>
            ) : (
              "Sign up"
            )}
          </MotionButton>
        </CardFooter>
      </form>
    </Card>
  );
}

export default SignUp;
