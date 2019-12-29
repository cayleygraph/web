import React from "react";
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import { runQuery } from "./queries";

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
  const [entityID, setEntityID] = React.useState("");
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState(null);
  const updateEntity = React.useCallback(
    entityID => {
      getEntity(serverURL, entityID)
        .then(result => {
          setResult(result);
        })
        .catch(error => {
          setError(error);
        });
    },
    [entityID, serverURL, setResult, setError]
  );
  const handleSubmit = React.useCallback(
    event => {
      event.preventDefault();
      updateEntity(entityID);
    },
    [entityID, updateEntity]
  );
  const handleChange = React.useCallback(
    event => {
      setEntityID(event.target.value);
    },
    [setEntityID]
  );
  return (
    <div style={{ width: "100%" }}>
      <h1>Entities</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Entity ID</label>
          <input
            onChange={handleChange}
            value={entityID}
            style={{ width: "100%" }}
          />
        </div>
        <input type="submit" />
      </form>
      <ul>
        {result &&
          Object.entries(result).map(([property, values]) => {
            if (!Array.isArray(values)) {
              throw new Error("Unexpected type of values");
            }
            const valueNodes = values.map(value => {
              if (typeof value === "object" && "@id" in value) {
                return (
                  <a
                    onClick={() => {
                      setEntityID(value["@id"]);
                      updateEntity(value["@id"]);
                    }}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    <li>{value["@id"]}</li>
                  </a>
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
            });
            return (
              <li>
                {property}: <ul>{valueNodes}</ul>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default EntitiesPage;
