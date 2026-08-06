import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

import renderField from "./RenderField";
import { signUpCreate } from "../../../../../actions";
import SignupLoading from "./SignupLoading";
import ErrorMessage from "./ErrorMessage";
import { useLanguage } from "../../../../../i18n/LanguageProvider";

const SubmitValidationForm = (props) => {
  const { language, t } = useLanguage();
  const monthNames = Array.from({ length: 12 }, (_, index) => (
    new Intl.DateTimeFormat(language, { month: "long", timeZone: "UTC" })
      .format(new Date(Date.UTC(2020, index, 1)))
  ));
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
  } = props;
  const onSubmit = (formValue) => {
    props.signUpCreate(formValue);
  };

  return (
    <>
      {props.loading.loading ? (
        <SignupLoading />
      ) : (
        <>
          {props.errorFromRedux && (
            <ErrorMessage error={props.errorFromRedux} />
          )}

          <form
            className="ui large form"
            style={{ padding: "1rem" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="field">
              <Field
                validate={[usernameValidate, required]}
                name="username"
                label={t("auth.username")}
                type="text"
                component={renderField}
                placeholder="Username"
                autoFocus={true}
              />
            </div>
            <div className="field">
              <Field
                label={t("auth.password")}
                name="password"
                type="password"
                component={renderField}
                placeholder="Password"
                validate={[password, required]}
              />
            </div>

            <div className="field">
              <Field
                label={t("auth.confirmPassword")}
                name="confirmPassword"
                type="password"
                component={renderField}
                placeholder="Confirm Password"
                validate={[required, confirmPassword]}
              />
            </div>

            <div className="field">
              <Field
                validate={[email, required]}
                label={t("auth.email")}
                name="email"
                type="email"
                component={renderField}
                placeholder="Email"
              />
            </div>
            <div className="field">
              <label style={{ color: "var(--theme-text)" }}>{t("auth.dateOfBirth")}</label>
              <Field
                className="app__select"
                name="dateofbirth"
                component="select"
                style={{ color: "var(--theme-text)" }}
              >
                <option value="">{t("auth.select")}</option>
                {monthNames.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </Field>
            </div>
            <div className="ui equal width form">
              <div className="fields">
                <div className="field">
                  <Field
                    validate={[minValue0, maxValue13, number]}
                    label={t("auth.month")}
                    name="month"
                    type="text"
                    component={renderField}
                    placeholder="Month"
                  />
                </div>
                <div className="field">
                  <Field
                    validate={[number, yearMinValue1930, yearMaxValue2020]}
                    label={t("auth.year")}
                    name="year"
                    type="text"
                    component={renderField}
                    placeholder="Year"
                  />
                </div>
              </div>
            </div>
            {/* {error && <strong>{error}</strong>} */}

            <div className="inline field">
              <label
                style={{
                  fontSize: "small", color: "var(--theme-text)"
                }}
              >
                {t("auth.terms")}
              </label>
            </div>

            <div
              style={{
                position: "relative",
                top: "11px",
              }}
            >
              <button
                // disabled={props.input.value}
                style={{
                  position: "relative",
                  bottom: "3px",
                  color: "white",
                  backgroundColor: "#00b5ad",
                }}
                className="ui fluid medium button"
                type="submit"
              >
                {t("nav.signup")}{" "}
              </button>
              <button
                className="ui fluid medium button"
                type="button"
                disabled={pristine || submitting}
                onClick={reset}
              >
                {t("auth.clear")}
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};
//username validation
const required = (value) => {
  return value ? undefined : "Required😒";
};
// Usernames must be between 3 and 30 characters.
const maxLength = (max) => (value) =>
  value && value.length > max
    ? `Must be ${max} characters or less😒`
    : undefined;
// const maxLength30 = maxLength(30);
////
// ? `Usernames must be between 4 and 30 characters😒`

const usernameValidate = (value) =>
  value &&
    !/^(?=.{4,30}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/i.test(value)
    ? "Invalid Username😒"
    : undefined;
/////password
const passWord8min = (min) => (value) =>
  value && value.length < min
    ? `Passwords must be at least ${min} characters long😒`
    : undefined;
// const passWord8minValidate = passWord8min(8);

const password = (value, allValues) => {
  if (value && !/^[a-zA-Z0-9]{8,30}$/i.test(value)) return "Invalid password😒";
  return undefined;
};
const confirmPassword = (value, allValues) => {
  if (value !== allValues.password) {
    return "Passwords don't match😒";
  }
  return undefined;
};

//month
const number = (value) =>
  value && isNaN(Number(value)) ? "Must be a number😒" : undefined;
const minValue = (min) => (value) =>
  value && value <= min ? `Invalid number😒` : undefined;
const minValue0 = minValue(0);
const maxValue = (min) => (value) =>
  value && value > min ? `Invalid number😒` : undefined;
const maxValue13 = maxValue(12);

//year
const yearMinValue = (min) => (value) =>
  value && value <= min ? `Invalid number😒` : undefined;
const yearMinValue1930 = yearMinValue(1930);
const yearMaxValue = (max) => (value) =>
  value && value > max ? `Invalid number😒` : undefined;
const yearMaxValue2020 = yearMaxValue(2020);
// minValue1930,number,maxValue2020
//email
const email = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address😒"
    : undefined;

// const selector = formValueSelector("submitValidation");
const mapStateToProps = (state) => {
  return {
    errorFromRedux: state.error.errorMessage,
    loading: state.loading,
    // join: state.join.signupState,
  };
};
export default connect(mapStateToProps, { signUpCreate })(
  reduxForm({
    form: "submitValidation", // a unique identifier for this form
  })(SubmitValidationForm)
);

// export default reduxForm({
//   form: "submitValidation", // a unique identifier for this form
// })(SubmitValidationForm);
