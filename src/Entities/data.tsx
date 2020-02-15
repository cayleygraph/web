import { runQuery } from "../queries";

// Namespaces
export const RDFS = "http://www.w3.org/2000/01/rdf-schema#";
export const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
export const XSD = "http://www.w3.org/2001/XMLSchema#";

// RDF
export const RDF_TYPE = RDF + "type";

// RDFS
export const RDFS_LABEL = RDFS + "label";
export const RDFS_CLASS = RDFS + "Class";
export const RDFS_SUB_CLASS_OF = RDFS + "subClassOf";
export const RDFS_COMMENT = RDFS + "comment";

// XSD
export const XSD_STRING = XSD + "string";

// JSON LD
export const JSON_LD_TYPE = "@type";

export type Suggestion = {
  value: string;
  label: string | { "@value": string; "@type": string };
};

type JsonLdReference = { "@id": string };
type JsonLdValue =
  | { "@value": string; "@language": string }
  | { "@value": string; "@type": string };

export function isReference(value: EntityValue): value is JsonLdReference {
  return typeof value === "object" && "@id" in value;
}

type GizmoQueryResult<T extends Object> = { result: T[] | null };
type GizmoQueryError = { error: string };

type GizmoQueryResponse<T extends Object> =
  | GizmoQueryResult<T>
  | GizmoQueryError;

function getResult<T>(response: GizmoQueryResponse<T>): T[] | null {
  if ("error" in response) {
    throw new Error(response.error);
  }
  return response.result;
}

export type EntityValue = JsonLdReference | JsonLdValue | string;
export type Label = string | JsonLdValue;

export type EntityValueRecord = {
  id: JsonLdReference;
  property: JsonLdReference;
  value: EntityValue;
  label?: Label;
};

type PropertyRecord = {
  id: JsonLdReference;
  label: Label;
};

export type Entity = {
  [id: string]: {
    label?: Label;
    values: Array<{
      value: EntityValue;
      label?: Label;
    }>;
  };
};

export async function getEntity(
  serverURL: string,
  entityID: string
): Promise<Entity | null> {
  const response: GizmoQueryResponse<
    EntityValueRecord | PropertyRecord
  > = await runQuery(
    serverURL,
    "gizmo",
    `
      g.addDefaultNamespaces();

      var entity = g.V(g.IRI("${entityID}"));
      
      entity
      .out(g.V(), "property")
      .tag("value")
      .saveOpt(g.IRI("rdfs:label"), "label")
      .getLimit(-1);

      entity
      .outPredicates()
      .save(g.IRI("rdfs:label"), "label")
      .getLimit(-1);
    `
  );
  const result = getResult(response);
  if (result === null) {
    return null;
  }
  const properties: Entity = {};
  for (const record of result) {
    if ("property" in record) {
      const propertyID =
        record.property["@id"] === RDF_TYPE
          ? JSON_LD_TYPE
          : record.property["@id"];
      const property = properties[propertyID] || { values: [] };
      property.values.push({
        value: record.value,
        label: record.label
      });
      properties[propertyID] = property;
    } else {
      console.log(record);
      const property = properties[record.id["@id"]];
      property.label = record.label;
    }
  }
  return properties;
}

const AUTO_SUGGESTION_RESULT_LIMIT = 12;

export async function getAutoCompletionSuggestions(
  serverURL: string,
  entityIDPrefix: string
): Promise<Suggestion[]> {
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
    .filter(
      result => typeof result.entity === "object" && "@id" in result.entity
    )
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

export type ClassRecord = {
  id: JsonLdReference;
  label: Label;
};

export async function getClasses(serverURL: string): Promise<ClassRecord[]> {
  const response: GizmoQueryResponse<ClassRecord> = await runQuery(
    serverURL,
    "gizmo",
    `
g.addDefaultNamespaces();

g.V(g.IRI("rdfs:Class"))
.in(g.IRI("rdf:type"))
.saveOpt(g.IRI("rdfs:label"), "label")
.unique()
.getLimit(-1);
  `
  );
  const result = getResult(response);
  if (result === null) {
    return [];
  }
  return result;
}
