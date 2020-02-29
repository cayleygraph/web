import React, { useCallback } from "react";
import { Checkbox } from "@rmwc/checkbox";
import "@material/checkbox/dist/mdc.checkbox.css";
import "@material/form-field/dist/mdc.form-field.css";

type Props = {
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
};

/**
 * @todo use `use-dark-mode`
 * @todo style page
 */

const SettingsPage = ({ onDarkModeChange, darkMode }: Props) => {
  const handleDarkModeChange = useCallback(
    event => {
      onDarkModeChange(event.currentTarget.checked);
    },
    [onDarkModeChange]
  );
  return (
    <div>
      <h1>Settings</h1>
      <Checkbox
        label="Dark Mode"
        checked={darkMode}
        onChange={handleDarkModeChange}
      />
    </div>
  );
};

export default SettingsPage;
