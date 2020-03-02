import React, { useCallback } from "react";
import { Checkbox } from "@rmwc/checkbox";
import "@material/checkbox/dist/mdc.checkbox.css";
import "@material/form-field/dist/mdc.form-field.css";
import "./SettingsPage.css";

type Props = {
  onDarkModeEnabledChange: (darkMode: boolean) => void;
  darkModeEnabled: boolean;
  queryEditorVerticalLayout: boolean;
  onQueryEditorVerticalLayoutChange: (verticalLayout: boolean) => void;
};

const SettingsPage = ({
  darkModeEnabled,
  onDarkModeEnabledChange,
  queryEditorVerticalLayout,
  onQueryEditorVerticalLayoutChange
}: Props) => {
  const handleDarkModeChange = useCallback(
    event => {
      onDarkModeEnabledChange(event.target.checked);
    },
    [onDarkModeEnabledChange]
  );
  const handleQueryEditorVerticalLayout = useCallback(
    event => {
      onQueryEditorVerticalLayoutChange(event.target.checked);
    },
    [onQueryEditorVerticalLayoutChange]
  );
  return (
    <main className="Settings">
      <h1>Settings</h1>
      <p>
        <Checkbox
          label="Dark Mode"
          checked={darkModeEnabled}
          onChange={handleDarkModeChange}
        />
      </p>
      <p>
        <Checkbox
          label="Query Editor Vertical Layout"
          checked={queryEditorVerticalLayout}
          onChange={handleQueryEditorVerticalLayout}
        />
      </p>
    </main>
  );
};

export default SettingsPage;
