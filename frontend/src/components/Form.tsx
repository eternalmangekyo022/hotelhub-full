import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import LoginFormInput from "../LoginFormInput";
import axios from "axios";
import React from "react";

interface IFormData {
  firstname?: string;
  lastname?: string;
  phone?: string;
  email: string;
  password: string;
}

interface IProps {
  register?: boolean;
}

export default function Login({ register }: IProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const url = register ? "api/v1/register" : "api/v1/login";
    try {
      const { data, status } = await axios.post(
        `http://localhost:3000/${url}`,
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );

      if (status !== 200)
        throw new Error(data.message || "Something went wrong");
      if (!register) localStorage.setItem("token", data.token);

      navigate({ to: register ? "/login" : "/register" }); // Redirect on success
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className={`login-wrapper${register ? " register" : ""}`}>
      <div className={`login-form-wrapper ${register ? "register" : "login"}`}>
        <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
          <div className="login-form-inner">
            <div className="form-title">
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
                    value={formData.firstname!}
                    setValue={(val) =>
                      setFormData({ ...formData, firstname: val })
                    }
                  >
                    First Name
                  </LoginFormInput>
                  <LoginFormInput
                    uid="login-lastname"
                    value={formData.lastname!}
                    setValue={(val) =>
                      setFormData({ ...formData, lastname: val })
                    }
                  >
                    Last Name
                  </LoginFormInput>
                  <LoginFormInput
                    uid="login-phone"
                    value={formData.phone!}
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
              <button className="no-select" type="button">
                {register ? "Register" : "Login"}
              </button>
              <span>
                {register
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <Link to={`/${register ? "Login" : "register"}`}>
                  {register ? "Login" : "Sign up"}
                </Link>
              </span>
            </div>
          </div>
        </form>
        <div className="login-image" />
      </div>
    </div>
  );
}
