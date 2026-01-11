import React, { forwardRef } from "react";
import { Form } from "react-router-dom";

const Forms = forwardRef(function Forms(
  { method, className, children, ...props },
  ref
) {
  return (
    <Form ref={ref} method={method} className={className} {...props}>
      {children}
    </Form>
  );
});

function Fieldset({
  className,
  legend,
  legendClassName,
  Icon,
  iconClassName,
  children,
}) {
  return (
    <fieldset className={className}>
      {legend && (
        <legend className={legendClassName}>
          {legend}
          {Icon && <Icon className={iconClassName} />}
        </legend>
      )}
      {children}
    </fieldset>
  );
}

const Input = forwardRef(function Input(
  { label, labelClassName, Element, elementClassName, children, ...props },
  ref
) {
  if (children) {
    return (
      <label className={labelClassName}>
        {label}
        {children}
      </label>
    );
  }
  return (
    <>
      {label && (
        <label className={labelClassName}>
          {Element && <Element className={elementClassName} />}
          {label}
          <input ref={ref} {...props} />
        </label>
      )}
      {!label && <input ref={ref} {...props} />}
    </>
  );
});

function Selection({
  name,
  className,
  options = [],
  optionsClassName,
  value = "",
  onChange,
  disabled = false,
  placeholder = "Please select...",
}) {
  return (
    <select
      name={name}
      className={className}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="" className={optionsClassName}>{placeholder}</option>

      {options.map((opt) => {
        const v = typeof opt === "object" ? opt.value : opt;
        const label = typeof opt === "object" ? opt.label : opt;
        return (
          <option key={v} value={v} className={optionsClassName}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

Forms.Fieldset = Fieldset;
Forms.Input = Input;
Forms.Button = Button;
Forms.Selection = Selection;

export default Forms;
