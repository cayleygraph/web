import React, { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { Theme } from "react-select";
import "./Search.css";

import { getAutoCompletionSuggestions, Label } from "./data";
import * as jsonLd from "./json-ld";
import { PRIMARY, LIST_ITEM_ACTIVE, LIST_ITEM_HOVER } from "./colors";
import EntityValue from "./EntityValue";

const OPTIONS_LIMIT = 10;

type Props = {
  onSelect: (value: jsonLd.Reference) => void;
  onError: (error: Error) => void;
  serverURL: string;
};

const Search = ({ onError, serverURL, onSelect }: Props) => {
  const loadOptions = useCallback(
    (query: string) => {
      return getAutoCompletionSuggestions(
        serverURL,
        query,
        OPTIONS_LIMIT
      ).catch(onError);
    },
    [serverURL, onError]
  );

  const handleChange = useCallback(
    selection => {
      const { value } = selection;
      onSelect(value);
    },
    [onSelect]
  );

  return (
    <AsyncSelect
      className="Search"
      loadOptions={loadOptions}
      theme={modifySelectTheme}
      onChange={handleChange}
      value={null}
      placeholder="Search Entity..."
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default Search;

const formatOptionLabel = (option: { value: jsonLd.Value; label: Label }) => (
  <EntityValue value={option.value} label={option.label} />
);

const modifySelectTheme = (theme: Theme): Theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: LIST_ITEM_HOVER,
    primary50: LIST_ITEM_ACTIVE,
    primary: PRIMARY
  }
});
