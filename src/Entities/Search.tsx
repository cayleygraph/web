import React, { useCallback } from "react";
import AsyncSelect from "react-select/async";
import "./Search.css";

import { getAutoCompletionSuggestions, Label, Labeled } from "./data";
import * as jsonLd from "./json-ld";
import { useSelectTheme } from "../colors";
import ID from "./ID";

const OPTIONS_LIMIT = 10;

type Props = {
  onSelect: (value: jsonLd.Reference) => void;
  onError: (error: Error) => void;
  serverURL: string;
};

type Option = {
  value: string;
  label: Label;
};

const Search = ({ onError, serverURL, onSelect }: Props) => {
  const selectTheme = useSelectTheme();
  const loadOptions = useCallback(
    (query: string) => {
      return getAutoCompletionSuggestions(serverURL, query, OPTIONS_LIMIT)
        .then((results) => results.map(toOption))
        .catch(onError);
    },
    [serverURL, onError]
  );

  const handleChange = useCallback(
    (selection) => {
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

const formatOptionLabel = (option: Option) => (
  <ID id={option.value} label={option.label} />
);

const toOption = (labeled: Labeled): Option => ({
  value: labeled["@id"],
  label: labeled.label,
});
