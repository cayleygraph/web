import { runQuery } from "../queries";

// Namespaces
export const RDFS = "http://www.w3.org/2000/01/rdf-schema#";
export const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
export const XSD = "http://www.w3.org/2001/XMLSchema#";
export const OWL = "http://www.w3.org/2002/07/owl#";

// RDF
export const RDF_TYPE = RDF + "type";
export const RDF_PROPERTY = RDF + "Property";

// RDFS
export const RDFS_LABEL = RDFS + "label";
export const RDFS_CLASS = RDFS + "Class";
export const RDFS_SUB_CLASS_OF = RDFS + "subClassOf";
export const RDFS_COMMENT = RDFS + "comment";

// XSD
export const XSD_STRING = XSD + "string";

// JSON LD
export const JSON_LD_TYPE = "@type";

// OWL
export const OWL_CLASS = OWL + "Class";
export const OWL_OBJECT_PROPERTY = OWL + "ObjectProperty";
export const OWL_DATA_PROPERTY = OWL + "DataProperty";
export const OWL_ANNOTATION_PROPERTY = OWL + "AnnotationProperty";

export type Suggestion = {
  value: JsonLdReference;
  label: Label;
};

export type JsonLdReference = { "@id": string };
export type JsonLdValue =
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

function normalizeID<T extends { id: JsonLdReference }>(
  result: T[] | null
): Array<JsonLdReference & Pick<T, Exclude<keyof T, "id">>> | null {
  if (result !== null) {
    return result.map(({ id, ...rest }) => ({ "@id": id["@id"], ...rest }));
  }
  return result;
}

export type EntityValue = JsonLdReference | JsonLdValue | string;
export type Label = string | JsonLdValue;

/**
 * An entity with identifier and label
 */
export type Labeled = JsonLdReference & {
  label: Label;
};

export type LabeledEntityValue = {
  value: EntityValue;
  label?: Label;
};

export type EntityValueRecord = LabeledEntityValue & {
  id: JsonLdReference;
  property: JsonLdReference;
};

type PropertyRecord = {
  id: JsonLdReference;
  label: Label;
};

type ListItemRecord = {
  value: JsonLdReference;
  item: EntityValue;
  itemLabel?: Label;
};

type GetEntityResultRecord =
  | EntityValueRecord
  | PropertyRecord
  | ListItemRecord;

export type Entity = {
  [id: string]: {
    label?: Label;
    values: Array<LabeledEntityValue | LabeledEntityValue[]>;
  };
};

function isEntityValueRecord(
  record: GetEntityResultRecord
): record is EntityValueRecord {
  return "property" in record;
}

function isListItemRecord(
  record: GetEntityResultRecord
): record is ListItemRecord {
  return "item" in record;
}

function escapeID(id: string): string {
  if (id.startsWith("_:")) {
    return id;
  }
  return `<${id}>`;
}

function normalizeGetEntityQueryResult(
  result: GetEntityResultRecord[]
): Entity {
  const lists: {
    [id: string]: Array<{ value: EntityValue; label?: Label }>;
  } = {};
  const properties: Entity = {};
  for (const record of result) {
    if (isListItemRecord(record)) {
      // list item record
      const list = lists[record.value["@id"]] || [];
      list.push({ value: record.item, label: record.itemLabel });
      lists[record.value["@id"]] = list;
    }
  }
  for (const record of result) {
    if (isListItemRecord(record)) {
      continue;
    }
    if (isEntityValueRecord(record)) {
      // entity value record
      const propertyID =
        record.property["@id"] === RDF_TYPE
          ? JSON_LD_TYPE
          : record.property["@id"];
      const property = properties[propertyID] || { values: [] };
      if (
        typeof record.value === "object" &&
        "@id" in record.value &&
        record.value["@id"] in lists
      ) {
        property.values.push(lists[record.value["@id"]]);
      } else {
        property.values.push({
          value: record.value,
          label: record.label
        });
      }
      properties[propertyID] = property;
    } else {
      // A property label record
      const property = properties[record.id["@id"]];
      property.label = record.label;
    }
  }
  return properties;
}

export async function getEntity(
  serverURL: string,
  entityID: string
): Promise<Entity | null> {
  const response: GizmoQueryResponse<GetEntityResultRecord> = await runQuery(
    serverURL,
    "gizmo",
    `
      g.addDefaultNamespaces();

      var entity = g.V("${escapeID(entityID)}");
      
      entity
      .out(g.V(), "property")
      .tag("value")
      .saveOpt(g.IRI("rdfs:label"), "label")
      .getLimit(-1);

      entity
      .out(g.V())
      .tag("value")
      .followRecursive(
        g
        .M()
        .tag("cursor")
        .out(g.IRI("rdf:first"))
        .tag("item")
        .saveOpt(g.IRI("rdfs:label"), "itemLabel")
        .back("cursor")
        .out(g.IRI("rdf:rest"))
      )
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
  return normalizeGetEntityQueryResult(result);
}

export async function getAutoCompletionSuggestions(
  serverURL: string,
  entityIDPrefix: string,
  limit: number
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
    .limit(${limit});
  
  var iriResults = g.V()
    .tag("entity")
    .filter(like("${entityIDPrefix}%"))
    .limit(${limit});
  
  labelResults
    .union(iriResults)
    .unique()
    .getLimit(${limit});
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
          label: result.label,
          value: result.entity
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

export type Page<T> = { total: number; data: T[] };

export async function getInstancesPage(
  serverURL: string,
  classID: string,
  pageNumber: number,
  pageSize: number
): Promise<Page<Labeled>> {
  const skip = pageNumber * pageSize;
  const query = `
    g.addDefaultNamespaces();
    
    var instances = g.V().has(g.IRI("rdf:type"), "${escapeID(classID)}")
    
    g.emit(instances.count());
    
    instances
    .saveOpt(g.IRI("rdfs:label"), "label")
    .skip(${skip})
    .getLimit(${pageSize});
    `;
  const response = await runQuery(serverURL, "gizmo", query);
  const result = getResult(response);
  const [total, ...items] = result || [];
  return {
    total,
    // @ts-ignore
    data: normalizeID(items) || []
  };
}

export async function getSubClassesPage(
  serverURL: string,
  classID: string,
  pageNumber: number,
  pageSize: number
): Promise<Page<Labeled>> {
  const skip = pageNumber * pageSize;
  const query = `
    g.addDefaultNamespaces();
    
    var subClasses = g.V().has(g.IRI("rdfs:subClassOf"), "${escapeID(classID)}")
    
    g.emit(subClasses.count());
    
    subClasses
    .saveOpt(g.IRI("rdfs:label"), "label")
    .skip(${skip})
    .getLimit(${pageSize});
    `;
  const response = await runQuery(serverURL, "gizmo", query);
  const result = getResult(response);
  const [total, ...items] = result || [];
  return {
    total,
    // @ts-ignore
    data: normalizeID(items) || []
  };
}

export async function getSuperClassesPage(
  serverURL: string,
  classID: string,
  pageNumber: number,
  pageSize: number
): Promise<Page<Labeled>> {
  const skip = pageNumber * pageSize;
  const query = `
    g.addDefaultNamespaces();
    
    var subClasses = g.V().hasR(g.IRI("rdfs:subClassOf"), "${escapeID(
      classID
    )}")
    
    g.emit(subClasses.count());
    
    subClasses
    .saveOpt(g.IRI("rdfs:label"), "label")
    .skip(${skip})
    .getLimit(${pageSize});
    `;
  const response = await runQuery(serverURL, "gizmo", query);
  const result = getResult(response);
  const [total, ...items] = result || [];
  return {
    total,
    // @ts-ignore
    data: normalizeID(items) || []
  };
}

export function isClass(types: Set<string>): boolean {
  return types.has(RDFS_CLASS) || types.has(OWL_CLASS);
}

export function isProperty(types: Set<string>): boolean {
  return (
    types.has(RDF_PROPERTY) ||
    types.has(OWL_OBJECT_PROPERTY) ||
    types.has(OWL_DATA_PROPERTY) ||
    types.has(OWL_ANNOTATION_PROPERTY)
  );
}
