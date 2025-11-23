import React from "react";
import { useForm } from "react-hook-form";
import "../mainCss/login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login:", data);
  };

  return (
    <div className="mainCont">
      <div className="auth-container">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            {errors.email && <p className="auth-error">Email required</p>}
          </div>

          <div>
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="auth-error">Password required</p>
            )}
          </div>

          <button className="auth-btn">Login</button>
        </form>

        <p className="auth-switch">
          No account yet? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
