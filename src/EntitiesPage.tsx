import React, { useEffect, useState, useCallback, Fragment } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import { runQuery } from "./queries";
import { useHistory, Link } from "react-router-dom";
import "./EntitiesPage.css";

type Props = {
  serverURL: string;
};

const RDFS = "http://www.w3.org/2000/01/rdf-schema#";
const RDFS_LABEL = RDFS + "label";
const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const RDF_TYPE = RDF + "type";

const Value = ({
  value,
  label
}: {
  value: string | { "@type": string; "@value": string };
  label: string | { "@type": string; "@value": string } | null;
}) => {
  if (typeof value === "object" && "@id" in value) {
    return (
      <Link to={entityLink(value["@id"])}>
        {label ? <Value value={label} label={null} /> : value["@id"]}
      </Link>
    );
  }
  if (typeof value === "string") {
    return <>{value}</>;
  }
  return (
    <>
      {value["@value"]} ({value["@type"]})
    </>
  );
};

async function getEntity(serverURL: string, entityID: string) {
  const result = await runQuery(
    serverURL,
    "gizmo",
    `
    g.addDefaultNamespaces();
    g
    .V(g.IRI("${entityID}"))
    .out(g.V(), "property")
    .tag("value")
    .saveOpt(g.IRI("rdfs:label"), "label")
    .getLimit(-1);
  `
  );
  if ("error" in result) {
    throw new Error(result.error);
  }
  if (result.result === null) {
    throw new Error("No result");
  }
  const properties: { [key: string]: any } = {};
  for (const record of result.result) {
    const values = properties[record.property["@id"]] || [];
    properties[record.property["@id"]] = [...values, record];
  }
  return properties;
}

type Suggestion = {
  value: string;
  label: string | { "@value": string; "@type": string };
};

const AUTO_SUGGESTION_RESULT_LIMIT = 12;

async function getAutoCompletionSuggestions(
  serverURL: string,
  entityIDPrefix: string
) {
  const result = await runQuery(
    serverURL,
    "gizmo",
    `
g.addDefaultNamespaces();

var labelResults = g.V()
  .tag("entity")
  .out(g.IRI("rdfs:label"))
  .tag("label")
  .filter(like("${entityIDPrefix}%"))
  .limit(${AUTO_SUGGESTION_RESULT_LIMIT});

var iriResults = g.V()
  .tag("entity")
  .filter(like("${entityIDPrefix}%"))
  .limit(${AUTO_SUGGESTION_RESULT_LIMIT});

labelResults
  .union(iriResults)
  .getLimit(${AUTO_SUGGESTION_RESULT_LIMIT});
  `
  );
  if ("error" in result) {
    throw new Error(result.error);
  }
  const results = result.result || [];
  return results
    .filter(result => "@id" in result.entity)
    .map(
      (result): Suggestion => {
        return {
          label: result.label
            ? typeof result.label === "object" && "@value" in result.label
              ? result.label["@value"]
              : result.label
            : result.entity["@id"],
          value: result.entity["@id"]
        };
      }
    );
}

const entityLink = (iri: string): string =>
  `/entities/${encodeURIComponent(iri)}`;

const PropertyName = ({ property }: { property: string }) => {
  if (property === RDFS_LABEL) {
    return <b>Label</b>;
  }
  if (property === RDF_TYPE) {
    return <b>Type</b>;
  }
  return (
    <b>
      <Link to={entityLink(property)}>{property}</Link>
    </b>
  );
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
