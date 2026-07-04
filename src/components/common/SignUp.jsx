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
import { useState } from "react";

function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const { handleRegister } = useAuth();
  const handleSubmit = () => {
    const signupInfo = {
      name: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      username: username,
      password: password,
    };
    handleRegister(signupInfo);
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome to My Budget Buddy</CardTitle>
        <CardDescription>
          Enter your details below to start your journey with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  type="text"
                  required
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  required
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirm-password">Confirm Password</Label>
              </div>
              <Input
                id="confirm-password"
                type="password"
                required
                onChange={(e) => {
                  setConfPassword(e.target.value);
                }}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <MotionButton type="submit" onClick={handleSubmit}>
          Sign up
        </MotionButton>
      </CardFooter>
    </Card>
  );
}

export default SignUp;
