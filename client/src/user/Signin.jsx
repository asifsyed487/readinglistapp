import React from "react";
import { useFormik } from "formik";
import { signinSchema } from "../schemas";
import { signin, authenticate, isAuthenticated } from "../auth";
import "./Signin.css";
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
const initialValues = {
  email: "",
  password: "",
  redirectToReferrer: false,
};

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signinSchema,
      onSubmit: (values, action) => {
        setLoading(true);
        signin(values).then((data) => {
          setLoading(false);
          if (data.error) {
            action.setFieldError("error", data.error);
            action.setSubmitting(false);
          } else {
            authenticate(data, () => {
              action.setFieldValue("redirectToReferrer", true);
            });
          }
        }); // sending js object
      },
    });
  const redirectUser = () => {
    if (values.redirectToReferrer) {
      if (isAuthenticated()) {
        return <Redirect to="/books" />;
      }
    }
  };
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: "100%",
          }}
        >
          <div
            className="spinner-grow"
            style={{ width: "5rem", height: "5rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="signin">
          {redirectUser()}
          <main className="form-signin w-100 m-auto">
            <form className="form" onSubmit={handleSubmit}>
              <img
                className="mb-4"
                src={process.env.PUBLIC_URL + "/images/logo.png"}
                alt=""
                width="130"
                height="35"
                style={{ width: "135px", height: "32px" }}
              />
              <h1 className="h4 mb-3 fw-normal">Sign in to your account</h1>
              <p className="text-sm-start fst-normal semi-strong-text">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
              <div className="mb-2 form-group required">
                <label htmlFor="email" className="form-label form-label-sm">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.error &&
                errors.error ===
                  "user with that email doesn't exist. please signup." ? (
                  <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                    {errors.error}
                  </p>
                ) : null}

                {errors.email && touched.email ? (
                  <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div className="mb-2 form-group required">
                <label htmlFor="password" className="form-label form-label-sm">
                  Password
                </label>
                <span style={{ display: "flex" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-sm"
                    id="password"
                    name="password"
                    placeholder="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <i
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}
                    style={{ marginLeft: "-30px", cursor: "pointer" }}
                  ></i>
                </span>

                {errors.error && errors.error === "password doesn't match" ? (
                  <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                    {errors.error}
                  </p>
                ) : null}
                {errors.password && touched.password ? (
                  <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                    {errors.password}
                  </p>
                ) : null}
              </div>
              <p className="thin-text">
                By signing in, you agree with our privacy and usage terms.
              </p>
              <button className="w-100 btn btn-sm btn-primary" type="submit">
                Sign in
              </button>
            </form>
          </main>
        </div>
      )}
    </>
  );
};

export default Signin;
