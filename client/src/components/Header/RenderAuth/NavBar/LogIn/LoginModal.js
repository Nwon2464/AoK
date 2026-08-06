
import React, { useState, forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { reset } from "redux-form";

import { clearAuthError } from "../../../../../actions";
import "./LoginModal.css";

const LoginModal = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  useImperativeHandle(ref, () => {
    return {
      openModal: () => open(),
      close: () => close(),
    };
  });
  const resetAuthModal = () => {
    dispatch(clearAuthError());
    dispatch(reset("LoginSubmitValidation"));
    dispatch(reset("submitValidation"));
  };
  const open = () => {
    resetAuthModal();
    setDisplay(true);
  };
  const close = () => {
    resetAuthModal();
    setDisplay(false);
  };
  if (display) {
    return ReactDOM.createPortal(
      <div className="modal-wrapper">
        <div onClick={close} className="modal-backdrop">
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-box modal__signup app-bk-color-1"
            style={{ backgroundColor: "var(--theme-surface-raised)" }}
          >
            {props.children}
          </div>
        </div>
      </div>,
      document.querySelector("#modal3")
    );
  }
  return null;
});
export default LoginModal;
