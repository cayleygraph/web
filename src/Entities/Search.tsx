import React, { useState, useCallback, useEffect } from "react";
import "./Search.css";
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
    [setQuery]
  );

  useEffect(() => {
    getAutoCompletionSuggestions(serverURL, query)
      .then(setSuggestions)
      .catch(onError);
  }, [query, setSuggestions, onError, serverURL]);

  useEffect(() => {
    setQuery(entityID);
  }, [entityID]);

  const shouldHideSuggestions =
    suggestions.length === 1 && suggestions[0].value === entityID;

  return (
    <form onSubmit={handleSubmit} className="Search">
      <label>Entity ID</label>
      <input type="text" onChange={handleChange} value={query} />
      <input type="submit" />
      {!shouldHideSuggestions && (
        <div className="suggestions">
          {suggestions.length === 0 && <div className="result">No results</div>}
          {suggestions.map((suggestion, i) => {
            return (
              <SearchItem key={i} suggestion={suggestion} onSelect={onSelect} />
            );
          })}
        </div>
      )}
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
