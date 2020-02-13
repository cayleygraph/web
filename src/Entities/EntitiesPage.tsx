import React, { useEffect, useState, useCallback, Fragment } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";

import { useHistory } from "react-router-dom";
import Value from "./Value";
import PropertyName from "./PropertyName";
import { getEntity, getAutoCompletionSuggestions, Suggestion } from "./data";
import { entityLink } from "./navigation";
import "./EntitiesPage.css";

type Props = {
  serverURL: string;
};

const EntitiesPage = ({ serverURL }: Props) => {
  const history = useHistory();
  const entityID = decodeURIComponent(
    history.location.pathname.replace(/^(\/)*entities(\/)*/, "")
  );
  const [temporalEntityID, setTemporalEntityID] = useState(entityID);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    setError(null);
    setResult(null);
    if (entityID) {
      getEntity(serverURL, entityID)
        .then(result => {
          setTemporalEntityID(entityID);
          setResult(result);
        })
        .catch(error => {
          setError(error);
        });
    }
  }, [entityID, serverURL, setResult, setError]);

  const goToEntity = useCallback(
    entityID => {
      setTemporalEntityID(entityID);
      history.push(entityLink(entityID));
    },
    [history, setTemporalEntityID]
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      goToEntity(temporalEntityID);
    },
    [temporalEntityID, goToEntity]
  );

  const handleChange = useCallback(
    event => {
      setTemporalEntityID(event.target.value);
      getAutoCompletionSuggestions(serverURL, event.target.value)
        .then(setSuggestions)
        .catch(setError);
    },
    [setTemporalEntityID, setSuggestions, setError, serverURL]
  );
  return (
    <>
      {error && <Snackbar open message={String(error)} />}
      <div className="EntitiesPage">
        <form onSubmit={handleSubmit} className="EntityID">
          <label>Entity ID</label>
          <input type="text" onChange={handleChange} value={temporalEntityID} />
          <input type="submit" />
          <div className="suggestions">
            {suggestions.map((suggestion, i) => {
              return (
                <div
                  className="result"
                  key={i}
                  onClick={() => {
                    goToEntity(suggestion.value);
                  }}
                >
                  {suggestion.label}
                </div>
              );
            })}
          </div>
        </form>
        <ul>
          {!entityID &&
            "Write an entity's IRI in the text box to view the entity"}
          {result &&
            Object.entries(result).map(([property, values], i) => {
              if (!Array.isArray(values)) {
                throw new Error("Unexpected type of values");
              }
              const valueNodes = values.map((record, i) => {
                const suffix = i === values.length - 1 ? null : ", ";
                return (
                  <Fragment key={i}>
                    <Value key={i} value={record.value} label={record.label} />
                    {suffix}
                  </Fragment>
                );
              });
              return (
                <li key={property}>
                  <PropertyName property={property} />: {valueNodes}
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default EntitiesPage;
