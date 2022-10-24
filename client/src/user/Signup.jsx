import React from "react";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import { signup } from "../auth";
import "./Signin.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const initialValues = {
  fullname: "",
  email: "",
  password: "",
  confirm_password: "",
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,
      onSubmit: (values, action) => {
        setLoading(true);
        signup(values).then((data) => {
          setLoading(false);
          // console.log(data.error);
          if (data.error) {
            action.setFieldError("general", data.error);
            action.setSubmitting(false);
          } else {
            setSuccess(true);
            action.resetForm();
          }
        }); // sending js object
      },
    });

  const showSuccess = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "0.1rem",
        marginBottom: "0rem",
      }}
    >
      <div
        className="alert alert-info"
        style={{ display: success ? "" : "none" }}
      >
        New account is created. Please <Link to="/signin">Signin</Link>.
      </div>
    </div>
  );

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
              <>
                {success ? (
                  <>{showSuccess()}</>
                ) : (
                  <>
                    <h1 className="h4 mb-3 fw-normal">Create free account</h1>

                    <p className="text-sm-start fst-normal semi-strong-text">
                      Already have an account? <Link to="/signin">Signin</Link>
                    </p>

                    <div className="mb-2 form-group required">
                      <label
                        htmlFor="fullname"
                        className="form-label form-label-sm"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="fullname"
                        name="fullname"
                        placeholder="Name"
                        value={values.fullname}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    {errors.fullname && touched.fullname ? (
                      <p
                        className="semi-strong-text"
                        style={{ color: "#A52A2A" }}
                      >
                        {errors.fullname}
                      </p>
                    ) : null}
                    <div className="mb-2 form-group required">
                      <label
                        htmlFor="email"
                        className="form-label form-label-sm"
                      >
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
                      {errors.general ? (
                        <p
                          className="semi-strong-text"
                          style={{ color: "#A52A2A" }}
                        >
                          {errors.general}
                        </p>
                      ) : null}
                      {errors.email && touched.email ? (
                        <p
                          className="semi-strong-text"
                          style={{ color: "#A52A2A" }}
                        >
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                    <div className="mb-2 form-group required">
                      <label
                        htmlFor="password"
                        className="form-label form-label-sm"
                      >
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
                          className={
                            showPassword ? "bi bi-eye" : "bi bi-eye-slash"
                          }
                          style={{ marginLeft: "-30px", cursor: "pointer" }}
                        ></i>
                      </span>
                      {errors.password && touched.password ? (
                        <p
                          className="semi-strong-text"
                          style={{ color: "#A52A2A" }}
                        >
                          {errors.password}
                        </p>
                      ) : null}
                    </div>
                    <div className="mb-2 form-group required">
                      <label
                        htmlFor="confirmpass"
                        className="form-label form-label-sm"
                      >
                        Confirm Password
                      </label>
                      <span style={{ display: "flex" }}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control form-control-sm"
                          id="confirmpass"
                          name="confirm_password"
                          placeholder="confirm password"
                          value={values.confirm_password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <i
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                          className={
                            showConfirmPassword
                              ? "bi bi-eye"
                              : "bi bi-eye-slash"
                          }
                          style={{ marginLeft: "-30px", cursor: "pointer" }}
                        ></i>
                      </span>
                      <span></span>
                      {errors.confirm_password && touched.confirm_password ? (
                        <p
                          className="semi-strong-text"
                          style={{ color: "#A52A2A" }}
                        >
                          {errors.confirm_password}
                        </p>
                      ) : null}
                    </div>
                    <p className="thin-text">
                      By signing up, you agree with our privacy and usage terms.
                    </p>
                    <button
                      className="w-100 btn btn-sm btn-primary"
                      type="submit"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </>
            </form>
          </main>
        </div>
      )}
    </>
  );
};

export default Signup;
