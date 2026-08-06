import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { logIn } from "../../../../../actions";
import LoginRenderField from "./LoginRenderField";
import ErrorMessage from "./ErrorMessage";
import SignupLoading from "./SignupLoading";
import { useLanguage } from "../../../../../i18n/LanguageProvider";
const LoginModalForm = (props) => {
  const { t } = useLanguage();
  const { handleSubmit } = props;
  const onSubmit = (formValue) => {
    // console.log(formValue);
    props.logIn(formValue);
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
          <>
            <form
              id="login__form"
              className="ui large form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="field" >
                <Field
                  // validate={[usernameValidate, required]}
                  name="username"
                  label={t("auth.username")}
                  type="text"
                  component={LoginRenderField}
                  placeholder="Username"
                  autoFocus={true}
                />
              </div>
              <div className="field">
                <Field
                  label={t("auth.password")}
                  name="password"
                  type="password"
                  component={LoginRenderField}
                  placeholder="Password"
                // validate={[password, required]}
                />
              </div>
              <div>
                <button className="ui fluid medium button" type="submit">
                  {t("nav.login")}
                </button>
              </div>
            </form>
          </>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    errorFromRedux: state.error.errorMessage,
    loading: state.loading,
    join: state.join.loginState,
  };
};
export default connect(mapStateToProps, { logIn })(
  reduxForm({
    form: "LoginSubmitValidation", // a unique identifier for this form
  })(LoginModalForm)
);
