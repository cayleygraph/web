import React, { useEffect } from "react";
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import { runQuery } from "./queries";
import { useParams, useHistory, Link } from "react-router-dom";

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
        {label ? <Value value={label} label={null} /> : <li>{value["@id"]}</li>}
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
  if (result === null) {
    throw new Error("No result");
  }
  if ("error" in result) {
    throw new Error(result.error);
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
  const [error, setError] = React.useState(null);
  useEffect(() => {
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
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: 16,
        background: "white"
      }}
    >
      <h1>Entities</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>Entity ID</label>
          <input
            onChange={handleChange}
            value={temporalEntityID}
            style={{ flex: 1, font: "inherit", marginLeft: 16 }}
          />
        </div>
        <input type="submit" style={{ display: "none" }} />
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
  );
};

export default EntitiesPage;
