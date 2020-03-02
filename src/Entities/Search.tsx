import React, { useCallback } from "react";
import AsyncSelect from "react-select/async";
import "./Search.css";

import { getAutoCompletionSuggestions, Label } from "./data";
import * as jsonLd from "./json-ld";
import { useSelectTheme } from "../colors";
import EntityValue from "./EntityValue";

const OPTIONS_LIMIT = 10;

type Props = {
  onSelect: (value: jsonLd.Reference) => void;
  onError: (error: Error) => void;
  serverURL: string;
};

const Search = ({ onError, serverURL, onSelect }: Props) => {
  const selectTheme = useSelectTheme();
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
      classNamePrefix="Select"
      loadOptions={loadOptions}
      theme={selectTheme}
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
