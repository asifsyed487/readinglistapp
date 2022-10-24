import * as Yup from "yup";

export const signUpSchema = Yup.object({
  fullname: Yup.string().min(2).max(25).required("Please enter your name"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string()
    .min(6)
    .required("Please enter your password")
    .test(
      "isValidPass",
      "must contain atleaset a number, an uppercase letter and any symbol(!#$%&'()*+,-./:;<=>?@[]^_`{|}~)",
      (value, context) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasSymbole = /["!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]/.test(value);
        let validConditions = 0;
        const numberOfMustBeValidConditions = 3;
        const conditions = [hasUpperCase, hasLowerCase, hasNumber, hasSymbole];
        conditions.forEach((condition) =>
          condition ? validConditions++ : null
        );
        if (
          hasUpperCase &&
          hasNumber &&
          hasLowerCase &&
          hasSymbole &&
          validConditions >= numberOfMustBeValidConditions
        ) {
          return true;
        }
        return false;
      }
    ),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

export const signinSchema = Yup.object({
  email: Yup.string().email().required("please enter your email"),
  password: Yup.string().required("please enter your password"),
});

export const bookSummarySchema = Yup.object({
  book_summary: Yup.string().required(
    "please add some information about this book"
  ),
});

export const bookSchema = Yup.object({
  title: Yup.string().min(2).max(25).required("Please enter book name"),
  published_year: Yup.string()
    .matches(/^[0-9]+$/, "must be only digits")
    .min(4, "must be exactly 4 digits")
    .max(4, "must be exactly 4 digits")
    .required("please enter publishing year"),

  author: Yup.string().min(2).max(25).required("please enter Author's name"),
});
