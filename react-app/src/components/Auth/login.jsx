import { useState, useEffect, useRef } from "react";
import styles from "../../components.css.styles/login.module.css"; // Ensure file is named .module.css
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ message: "Login", status: true });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState(""); // success or error
  const [inputFocus, setInputFocus] = useState({});

  const navigate = useNavigate();
  const formRef = useRef(null);
  const notificationRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (error.message !== "Login") {
      setShowNotification(true);
      setNotificationType(error.status ? "success" : "error");
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formRef.current) {
        formRef.current.style.opacity = "1";
        formRef.current.style.transform = "translateY(0) scale(1)";
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const onLoginSubmit = (data) => {
    if (isLoading) return;
    setIsLoading(true);
    fetch("https://campushub-mq9h.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 429) {
          setError({
            message: "Too many attempts. Try again in a minute.",
            status: false,
          });
          return null;
        }
        return res.json();
      })
      .then((result) => {
        if (!result) return;
        if (result.success === true) {
          setError({ message: "Login successful", status: true });
          setTimeout(() => {
            navigate("/homepage");
          }, 1500);
          reset();
        } else {
          setError({
            message: result.message || "Login failed",
            status: result.success,
          });
        }
      })
      .catch((err) => {
        /* handle error */
      })
      .finally(() => setIsLoading(false));
  };

  const handleFocus = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: true }));
  };
  const handleBlur = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["bg-animation"]}>
        <div className={styles["gradient-bg"]}></div>
        <div className={styles["floating-shapes"]}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`${styles.shape} ${styles[`shape-${i}`]}`}
            ></div>
          ))}
        </div>
      </div>

      <div
        ref={notificationRef}
        className={`${styles.notification} ${showNotification ? styles.show : ""} ${styles[notificationType]}`}
        onClick={() => setShowNotification(false)}
      >
        <div className={styles["notification-icon"]}>
          {notificationType === "success" ? "✓" : "⚠"}
        </div>
        <div className={styles["notification-content"]}>
          <p className={styles["notification-message"]}>{error.message}</p>
          <p className={styles["notification-subtitle"]}>
            {notificationType === "success"
              ? "Success"
              : "Please check your details"}
          </p>
        </div>
        <button className={styles["notification-close"]}>×</button>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onLoginSubmit)}
        className={styles["login-form"]}
      >
        <div className={styles["form-header"]}>
          <div className={styles.logo}>
            <span className={styles["logo-icon"]}>🎓</span>
            <span className={styles["logo-text"]}>CampusHub</span>
          </div>
          <h2 className={styles["form-title"]}>
            <span className={styles["title-text"]}>Welcome Back</span>
            <div className={styles["title-underline"]}></div>
          </h2>
          <p className={styles["form-subtitle"]}>
            Sign in to access your campus services
          </p>
        </div>

        <div className={`${styles["form-step"]} ${styles["login-step"]}`}>
          <div className={styles["input-group"]}>
            <div
              className={`${styles["input-container"]} ${inputFocus.email ? styles.focused : ""}`}
            >
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder=" "
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className={`${styles["login-input"]} ${errors.email ? styles.error : ""}`}
              />
              <label className={styles["input-label"]}>Email Address</label>
              <div className={styles["input-border"]}></div>
              {errors.email && (
                <div className={styles["error-indicator"]}>!</div>
              )}
            </div>
            {errors.email && (
              <p className={styles["input-error"]}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles["input-group"]}>
            <div
              className={`${styles["input-container"]} ${inputFocus.password ? styles.focused : ""}`}
            >
              <input
                type="password"
                {...register("password", { required: "Password required" })}
                placeholder=" "
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                className={`${styles["login-input"]} ${errors.password ? styles.error : ""}`}
              />
              <label className={styles["input-label"]}>Password</label>
              <div className={styles["input-border"]}></div>
              {errors.password && (
                <div className={styles["error-indicator"]}>!</div>
              )}
            </div>
            {errors.password && (
              <p className={styles["input-error"]}>{errors.password.message}</p>
            )}
          </div>

          <p className={styles["signup-link"]}>
            Don't have an account?{" "}
            <Link to="/signup" className={styles["link-button"]}>
              Sign Up
            </Link>
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles["submit-button"]} ${isLoading ? styles.loading : ""}`}
        >
          <span className={styles["button-text"]}>
            {isLoading ? "Please wait..." : "Login"}
          </span>
          <span className={styles["button-loader"]}>
            <div className={styles.spinner}></div>
          </span>
          <span className={styles["button-icon"]}>→</span>
        </button>

        <div className={styles["form-footer"]}>
          <p className={styles["security-note"]}>
            🔒 Your login is secured with end-to-end encryption
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
