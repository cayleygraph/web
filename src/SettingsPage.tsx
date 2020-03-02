import React, { useCallback } from "react";
import { Checkbox } from "@rmwc/checkbox";
import "@material/checkbox/dist/mdc.checkbox.css";
import "@material/form-field/dist/mdc.form-field.css";
import "./SettingsPage.css";

type Props = {
  onDarkModeEnabledChange: (darkMode: boolean) => void;
  darkModeEnabled: boolean;
};

const SettingsPage = ({ darkModeEnabled, onDarkModeEnabledChange }: Props) => {
  const handleChange = useCallback(
    event => {
      onDarkModeEnabledChange(event.target.checked);
    },
    [onDarkModeEnabledChange]
  );
  return (
    <main className="Settings">
      <h1>Settings</h1>
      <Checkbox
        label="Dark Mode"
        checked={darkModeEnabled}
        onChange={handleChange}
      />
    </main>
  );
};

export default SettingsPage;
