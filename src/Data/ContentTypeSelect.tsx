import React, { useCallback } from "react";
import Select from "react-select";
import { useSelectTheme } from "../colors";
import { ContentType } from "./data";
import * as mime from "../mime";

type Props = {
  value: ContentType;
  onChange: (contentType: ContentType) => void;
};

const OPTIONS: Array<{ label: string; value: ContentType }> = [
  { label: "JSON-LD", value: mime.JSON_LD },
  { label: "N-Quads", value: mime.N_QUADS }
];

export const ContentTypeSelect = ({ value, onChange }: Props) => {
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
