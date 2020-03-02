import React, { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { Theme } from "react-select";
import "./Search.css";

import { getAutoCompletionSuggestions, Label } from "./data";
import * as jsonLd from "./json-ld";
import { useColors } from "./colors";
import EntityValue from "./EntityValue";

const OPTIONS_LIMIT = 10;

type Props = {
  onSelect: (value: jsonLd.Reference) => void;
  onError: (error: Error) => void;
  serverURL: string;
};

const Search = ({ onError, serverURL, onSelect }: Props) => {
  const colors = useColors();
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

  const modifySelectTheme = useCallback(
    (theme: Theme): Theme => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: colors.LIST_ITEM_HOVER,
        primary50: colors.LIST_ITEM_ACTIVE,
        primary: colors.PRIMARY,
        neutral80: colors.TEXT_COLOR,
        neutral20: colors.CHEVRON_COLOR,
        neutral50: colors.ACTIVE_CHEVRON_COLOR
      }
    }),
    [colors]
  );

  return (
    <AsyncSelect
      className="Search"
      classNamePrefix="Select"
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
