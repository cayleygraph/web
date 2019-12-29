import React, { useEffect, useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import { runQuery } from "./queries";
import { useHistory, Link } from "react-router-dom";
import "./EntitiesPage.css";

type Props = {
  serverURL: string;
};

const Value = ({
  value,
  label
}: {
  value: string | { "@type": string; "@value": string };
  label: string | { "@type": string; "@value": string } | null;
}) => {
  if (typeof value === "object" && "@id" in value) {
    return (
      <Link to={`/entities/${encodeURIComponent(value["@id"])}`}>
        <li>{label ? <Value value={label} label={null} /> : value["@id"]}</li>
      </Link>
    );
  }
  if (typeof value === "string") {
    return <li>{value}</li>;
  }
  return (
    <li>
      {value["@value"]} ({value["@type"]})
    </li>
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

const EntitiesPage = ({ serverURL }: Props) => {
  const history = useHistory();
  const entityID = decodeURIComponent(
    history.location.pathname.replace("/entities/", "")
  );
  const [temporalEntityID, setTemporalEntityID] = React.useState(entityID);
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<Error | null>(null);
  useEffect(() => {
    if (entityID) {
      setError(null);
      setResult(null);
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
  const handleSubmit = React.useCallback(
    event => {
      event.preventDefault();
      history.push(`/entities/${encodeURIComponent(temporalEntityID)}`);
    },
    [temporalEntityID]
  );
  const handleChange = React.useCallback(
    event => {
      setTemporalEntityID(event.target.value);
    },
    [setTemporalEntityID]
  );
  return (
    <>
      {error && <Snackbar open message={String(error)} />}
      <div className="EntitiesPage">
        <h1>Entities</h1>
        <form onSubmit={handleSubmit} className="EntityID">
          <label>Entity ID</label>
          <input type="text" onChange={handleChange} value={temporalEntityID} />
          <input type="submit" />
        </form>
        <ul>
          {result &&
            Object.entries(result).map(([property, values]) => {
              if (!Array.isArray(values)) {
                throw new Error("Unexpected type of values");
              }
              const valueNodes = values.map((record, i) => {
                return (
                  <Value key={i} value={record.value} label={record.label} />
                );
              });
              return (
                <li key={property}>
                  {property}: <ul>{valueNodes}</ul>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default EntitiesPage;
