import React from "react";
import { useForm } from "react-hook-form";
import "../mainCss/login.css";
import { Link } from "react-router-dom";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Sign Up:", data);
  };

  return (
    <div className="mainCont">
      <div className="auth-container">
        <h2 className="auth-title">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div>
            <input
              className="auth-input"
              placeholder="Username"
              {...register("username", { required: true })}
            />
            {errors.username && <p className="auth-error">Username required</p>}
          </div>

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
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <p className="auth-error">Min length is 6</p>
            )}
          </div>

          <button className="auth-btn">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
