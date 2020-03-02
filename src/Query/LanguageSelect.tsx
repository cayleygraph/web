import React, { useCallback } from "react";
import Select from "react-select";
import { useSelectTheme } from "../colors";
import { languageOptions, Language } from "../queries";

type Props = {
  value: Language;
  onChange: (language: Language) => void;
};

const LanguageSelect = ({ value, onChange }: Props) => {
  const selectTheme = useSelectTheme();
  const selected = languageOptions.find(option => option.value === value);
  const handleLanguageChange = useCallback(
    selection => {
      onChange(selection.value);
    },
    [onChange]
  );
  return (
    <Select
      className="Select"
      theme={selectTheme}
      options={languageOptions}
      value={selected}
      onChange={handleLanguageChange}
    />
  );
};

export default LanguageSelect;
