import { useState } from "react";
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
import MotionButton from "@/components/motionUI/MotionButton";
import { useAuth } from "@/hooks/useAuth";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useAuth();

  const handleSubmit = () => {
    const signinInfo = {
      username: username,
      password: password,
    };
    handleLogin(signinInfo);
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email or username below to login to your account
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Username/Email</Label>
              <Input
                id="email"
                type="text"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
        </CardContent>
      </form>
      <CardFooter className="flex justify-end mt-4">
        <MotionButton type="submit" onClick={handleSubmit}>
          Login
        </MotionButton>
      </CardFooter>
    </Card>
  );
}

export default LogIn;
