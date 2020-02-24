import { runQuery } from "../queries";
import {
  RDF_TYPE,
  RDF_PROPERTY,
  RDFS_CLASS,
  JSON_LD_TYPE,
  OWL_CLASS,
  OWL_OBJECT_PROPERTY,
  OWL_DATA_PROPERTY,
  OWL_ANNOTATION_PROPERTY
} from "./constants";
import * as jsonLd from "./json-ld";
import { GizmoQueryResponse, getResult, normalizeID, escapeID } from "./gizmo";

export {
  RDFS_COMMENT as commentPropertyID,
  RDF_PROPERTY as propertyTypeID,
  RDFS_LABEL as labelPropertyID,
  JSON_LD_TYPE as typePropertyID,
  RDFS_SUB_CLASS_OF as subClassOfPropertyID
} from "./constants";

export type Suggestion = {
  value: jsonLd.Reference;
  label: Label;
};

/** Supported label value, represents allowed value for the rdfs:label property */
export type Label = jsonLd.PrimitiveValue;

/**
 * An entity with identifier and label
 */
export type Labeled = jsonLd.Reference & {
  label: Label;
};

export type LabeledEntityValue = {
  value: jsonLd.Value;
  label?: Label;
};

export type EntityValueRecord = LabeledEntityValue & {
  id: jsonLd.Reference;
  property: jsonLd.Reference;
};

type PropertyRecord = {
  id: jsonLd.Reference;
  label: Label;
};

type ListItemRecord = {
  value: jsonLd.Reference;
  item: jsonLd.Value;
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

function normalizeGetEntityQueryResult(
  result: GetEntityResultRecord[]
): Entity {
  const lists: {
    [id: string]: Array<{ value: jsonLd.Value; label?: Label }>;
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
      .saveOpt(g.IRI("rdf:type"), "type")
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
  id: jsonLd.Reference;
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

/**
 * Get super classes of given class, excluding restrictions.
 */
export async function getSuperClassesPage(
  serverURL: string,
  classID: string,
  pageNumber: number,
  pageSize: number
): Promise<Page<Labeled>> {
  const skip = pageNumber * pageSize;
  const query = `
    g.addDefaultNamespaces();
    g.addNamespace("owl", "http://www.w3.org/2002/07/owl#");

    var subClasses = (
      g.V()
      .hasR(g.IRI("rdfs:subClassOf"), "${escapeID(classID)}")
      .out(g.IRI("rdf:type"))
      .except(g.V(g.IRI("owl:Restriction")))
      .back()
    );
    
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

type NativeIDDescriptor = {
  label: string;
  link: string;
};

const nativeIDDescriptors: { [id: string]: NativeIDDescriptor } = {
  RDFS_CLASS: {
    label: "Class",
    link: "https://www.w3.org/TR/rdf-schema/#ch_class"
  },
  RDF_PROPERTY: {
    label: "Property",
    link: "https://www.w3.org/TR/rdf-schema/#ch_property"
  }
};

export function getNativeIDDescriptor(
  id: string
): NativeIDDescriptor | undefined {
  return nativeIDDescriptors[id];
}
