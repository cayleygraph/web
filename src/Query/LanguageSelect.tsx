import React, { useCallback } from "react";
import { Select } from "@rmwc/select";
import { languageOptions, Language } from "../queries";

type Props = {
  value: Language;
  onChange: (language: Language) => void;
};

const LanguageSelect = ({ value, onChange }: Props) => {
  const handleLanguageChange = useCallback(
    (event: any) => {
      onChange(event.target.value);
    },
    [onChange]
  );
  return (
    <Select
      outlined
      options={languageOptions}
      value={value}
      onChange={handleLanguageChange}
    />
  );
};

export default LanguageSelect;
