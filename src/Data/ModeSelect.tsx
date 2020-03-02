import React, { useCallback } from "react";
import Select from "react-select";
import { useSelectTheme } from "../colors";

export enum Mode {
  write = "write",
  delete = "delete"
}

type Props = {
  value: Mode;
  onChange: (mode: Mode) => void;
};

const OPTIONS = [
  { label: "Write", value: Mode.write },
  { label: "Delete", value: Mode.delete }
];

export const ModeSelect = ({ value, onChange }: Props) => {
  const selectTheme = useSelectTheme();
  const handleChange = useCallback(
    selection => {
      onChange(selection.value);
    },
    [onChange]
  );
  const selection = OPTIONS.find(option => option.value === value);
  return (
    <Select
      className="Select"
      theme={selectTheme}
      value={selection}
      onChange={handleChange}
      options={OPTIONS}
    />
  );
};
