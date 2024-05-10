import { ComponentProps, useMemo } from "react";
import { twJoin } from "tailwind-merge";
import { utils } from "../../utils/utils";

export const Select = (props: SelectProps) => {
  const id = useMemo(() => utils.nextDOMID(), []);
  const { label, error, className, ...selectProps } = props;

  return (
    <div className={twJoin("w-full grid gap-1", className)}>
      <label htmlFor={id}>{label}</label>
      <select
        {...selectProps}
        className={twJoin(
          "bg-transparent border-2 p-1 *:text-black rounded-none outline-none",
          error ? "border-danger" : "border-primary"
        )}
      />
      {error && <div className="text-danger text-sm">{error}</div>}
    </div>
  );
};

type SelectProps = ComponentProps<"select"> & {
  label: any;
  error?: any;
};
