/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance, NewAxiosResponse } from "@/lib/fetch";
import { loginUserSchema } from "@/lib/schema";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/build/Logo";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/stateStore";

type LoginSchemaType = z.infer<typeof loginUserSchema>;

export default function Login() {
  const { setToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(loginUserSchema) });

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(!loading);

    try {
      const response: NewAxiosResponse = await axiosInstance.post(
        `/auth/login`,
        {
          username: data.username,
          password: data.password,
        }
      );
      setToken("jh7ws89shs7823jwe");
      setUser(response.data.data);

      toast({
        title: `${response.data ? response.data.message : "Success"}`,
        description: `welcome back, ${data.username}`,
      });

      return navigate("/play");
    } catch (error: any) {
      // console.log(error.response.data);

      if (error.request) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: `${error.response.data.message}`,
        });
        return null;
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong, try again later!",
        });
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="h-full w-full px-2 py-4 sm:w-2/3 md:w-1/2">
          <div className="mx-auto flex flex-col justify-center px-2">
            <div className="mb-2">
              <Logo className="" text="Converse" />
            </div>

            <h1 className="text-2xl font-medium">Welcome back!</h1>
            <Label className="text-neutral-500">
              Log in to reconnect with your friends and communities.
            </Label>

            <form
              method="post"
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-y-4"
            >
              <div>
                <Label className="text-xs">Username</Label>
                <Input
                  type="text"
                  {...register("username")}
                  placeholder="Enter your username."
                />
                {errors.username && (
                  <Label className="text-xs text-red-500">
                    {errors.username?.message}
                  </Label>
                )}
              </div>
              <div>
                <Label className="text-xs">Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Enter your password."
                />
                {errors.password && (
                  <Label className="text-xs text-red-500">
                    {errors.password?.message}
                  </Label>
                )}
                <p className="mt-2 text-right text-sm font-medium text-purple-600">
                  Forgot your password?{" "}
                  <Link to="/forgot-password" className="underline">
                    Reset it here
                  </Link>
                </p>
              </div>

              <Button type="submit" className="mt-4">
                {loading ? <Loader2 className="animate-spin" /> : "Log In"}
              </Button>

              <p className="flex items-center gap-2 text-center text-sm font-medium text-neutral-500">
                Don't have an account?{" "}
                <Link to="/register" className="underline-offset-1">
                  <span className="text-purple-600">Register here</span>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
