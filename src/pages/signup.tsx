import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/auth";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom";

const Signup = function() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = () => {
    signup(username, password);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle>Signup to your account</CardTitle>
        <CardDescription>
          Enter your email below to Signup to your account
        </CardDescription>
        <CardAction>
          <Link to='/login'>
          <Button variant="link" >Login</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
                value={password }
                onChange={(e) => setPassword(e.target.value)}
                 />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleSignup}>
          Sign Up
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Signup