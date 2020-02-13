import React, { useState, useCallback, useEffect } from "react";
import { getAutoCompletionSuggestions, Suggestion } from "./data";

type OnSelect = (entityID: string) => void;

type Props = {
  entityID: string;
  onError: (error: Error) => void;
  onSelect: OnSelect;
  serverURL: string;
};

const Search = ({ entityID, onError, serverURL, onSelect }: Props) => {
  const [query, setQuery] = useState(entityID);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      onSelect(query);
    },
    [query, onSelect]
  );

  const handleChange = useCallback(
    event => {
      setQuery(event.target.value);
    },
    [setQuery, setSuggestions, onError, serverURL]
  );

  useEffect(() => {
    getAutoCompletionSuggestions(serverURL, query)
      .then(setSuggestions)
      .catch(onError);
  }, [query]);

  return (
    <form onSubmit={handleSubmit} className="EntityID">
      <label>Entity ID</label>
      <input type="text" onChange={handleChange} value={query} />
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
