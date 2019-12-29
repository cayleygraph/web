import React, { useEffect } from "react";
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import { runQuery } from "./queries";
import { useParams, useHistory } from "react-router-dom";

type Props = {
  serverURL: string;
};

async function getEntity(serverURL: string, entityID: string) {
  const result = await runQuery(
    serverURL,
    "gizmo",
    `
    g
    .V(g.IRI("${entityID}"))
    .out(g.V(), "property")
    .tag("value")
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
    properties[record.property["@id"]] = [...values, record.value];
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
            const valueNodes = values.map((value, i) => {
              if (typeof value === "object" && "@id" in value) {
                return (
                  <a
                    key={i}
                    onClick={() => {
                      history.push(
                        `/entities/${encodeURIComponent(value["@id"])}`
                      );
                    }}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    <li>{value["@id"]}</li>
                  </a>
                );
              }
              if (typeof value === "string") {
                return <li key={i}>{value}</li>;
              }
              return (
                <li key={i}>
                  {value["@value"]} ({value["@type"]})
                </li>
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
