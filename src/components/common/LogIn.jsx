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

function LogIn() {
  const { handleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleUserLogin = async (data) => {
    const signinInfo = {
      username: data.username,
      password: data.password,
    };
    await handleLogin(signinInfo);
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email or username below to login to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleUserLogin)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username/Email</Label>
              <Input
                id="username"
                type="text"
                {...register("username", {
                  required: "Username or Email is required",
                })}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <MotionButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Logging in
              </>
            ) : (
              "Login"
            )}
          </MotionButton>
        </CardFooter>
      </form>
    </Card>
  );
}

export default LogIn;
