import { Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import LoginFormInput from "../LoginFormInput";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { userAtom } from "@/store";
import { useAtom } from "jotai";

interface IFormData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
}

interface IProps {
  register?: boolean;
}

export default function Login({ register }: IProps) {
  const [error, setError] = useState<string>("");
  const [user, setUser] = useAtom(userAtom);

  const { isLoading, refetch } = useQuery({
    queryKey: [register ? "register" : "login"],
    async queryFn() {
      try {
        const {
          data: { user },
        } = await axios.post<{ user: User }>(
          "http://localhost:3000/api/v1/login",
          {
            email: formData.email,
            password: formData.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setUser(user);
        return user;
      } catch (e) {
        setError((e as { message: string }).message);
        return null;
      }
    },
    enabled: false,
    retry: false,
  });

  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  useEffect(() => {
    if (user) redirect({ to: "/" });
  }, []);

  return (
    <div className={`login-wrapper${register ? " register" : ""} bg-base-100`}>
      <div className={`login-form-wrapper ${register ? "register" : "login"}`}>
        <form className="login-form">
          <div className="login-form-inner">
            <div className="form-title dark:text-black">
              <h1>{register ? "Register" : "Welcome back"}</h1>
              <h2>
                {register
                  ? "Create a HotelHub account"
                  : "Sign in to your HotelHub account"}
              </h2>
            </div>
            <div className="inputs-wrapper">
              {register && (
                <>
                  <LoginFormInput
                    uid="login-firstname"
                    value={formData.firstname}
                    setValue={(val) =>
                      setFormData({ ...formData, firstname: val })
                    }
                    maxLength={20}
                  >
                    First Name
                  </LoginFormInput>
                  <LoginFormInput
                    uid="login-lastname"
                    value={formData.lastname}
                    setValue={(val) =>
                      setFormData({ ...formData, lastname: val })
                    }
                  >
                    Last Name
                  </LoginFormInput>
                  <LoginFormInput
                    uid="login-phone"
                    value={formData.phone}
                    setValue={(val) => setFormData({ ...formData, phone: val })}
                  >
                    Phone
                  </LoginFormInput>
                </>
              )}
              <LoginFormInput
                uid="login-email"
                value={formData.email}
                setValue={(val) => setFormData({ ...formData, email: val })}
              >
                Email
              </LoginFormInput>
              <LoginFormInput
                uid="login-password"
                value={formData.password}
                setValue={(val) => setFormData({ ...formData, password: val })}
                maxLength={16}
              >
                Password
              </LoginFormInput>
            </div>
            <div className="actions">
              {!register && (
                <div className="forgot-password">
                  <span className="no-select">Forgot your password?</span>
                </div>
              )}
              {error && <p className="error">{error}</p>}
              <button
                className="no-select"
                type="button"
                onClick={() => refetch()}
              >
                {isLoading ? (
                  <span className="du-loading du-loading-spinner w-6 h-6"></span>
                ) : (
                  <>{register ? "Register" : "Login"}</>
                )}
              </button>
            </div>
          </div>
        </form>
        <div className={`login-sidebar ${register ? "register" : "login"}`}>
          <div className="content">
            <h1>{register ? "Hello, Welcome!" : "Welcome back!"}</h1>
            <h2>{register ? "Already have an account?" : "Not registered?"}</h2>
            <Link
              to={register ? ("/login" as string) : ("/register" as string)}
              className={register ? "register" : "login"}
            >
              {register ? "Login" : "Sign up"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
