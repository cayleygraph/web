import React, { useState, useCallback } from "react";
import { getAutoCompletionSuggestions, Suggestion } from "./data";

type OnSelect = (entityID: string) => void;

type Props = {
  entityID: string;
  onError: (error: Error) => void;
  onSelect: OnSelect;
  serverURL: string;
};

const Search = ({ entityID, onError, serverURL, onSelect }: Props) => {
  const [temporalEntityID, setTemporalEntityID] = useState(entityID);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      onSelect(temporalEntityID);
    },
    [temporalEntityID, onSelect]
  );

  const handleChange = useCallback(
    event => {
      setTemporalEntityID(event.target.value);
      getAutoCompletionSuggestions(serverURL, event.target.value)
        .then(setSuggestions)
        .catch(onError);
    },
    [setTemporalEntityID, setSuggestions, onError, serverURL]
  );

  return (
    <form onSubmit={handleSubmit} className="EntityID">
      <label>Entity ID</label>
      <input type="text" onChange={handleChange} value={temporalEntityID} />
      <input type="submit" />
      <div className="suggestions">
        {suggestions.map((suggestion, i) => {
          return (
            <SearchItem key={i} suggestion={suggestion} onSelect={onSelect} />
          );
        })}
      </div>
    </form>
  );
};

export default Search;

const SearchItem = ({
  suggestion,
  onSelect
}: {
  suggestion: Suggestion;
  onSelect: OnSelect;
}) => {
  const handleSelect = () => {
    onSelect(suggestion.value);
  };
  return (
    <div className="result" onClick={handleSelect}>
      {suggestion.label}
    </div>
  );
};
