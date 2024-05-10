import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { utils } from "../../utils/utils";

export const TextField = (props: TextFieldProps) => {
  const id = utils.nextDOMID();
  const { label, labelClassname, error, ...inputProps } = props;

  return (
    <div className={twMerge(labelClassname, "form-group")}>
      <input
        className={`form-control ${error ? "error" : ""}`}
        placeholder=""
        {...inputProps}
      ></input>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {error && <label className="error">{error}</label>}
    </div>
  );
};

type TextFieldProps = ComponentProps<"input"> & {
  label: any;
  labelClassname?: string;
  error?: string;
};
