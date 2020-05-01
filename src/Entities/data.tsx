import { runQuery } from "../queries";
import {
  RDF_TYPE,
  RDF_PROPERTY,
  RDFS_CLASS,
  JSON_LD_TYPE,
  OWL_CLASS,
  OWL_OBJECT_PROPERTY,
  OWL_DATA_PROPERTY,
  OWL_ANNOTATION_PROPERTY,
  RDFS_LABEL,
  RDFS_SUB_CLASS_OF,
  RDFS_DATATYPE,
} from "./constants";
import * as jsonLd from "./json-ld";
import { GizmoQueryResponse, getResult, normalizeID, escapeID } from "./gizmo";

export {
  RDFS_COMMENT as commentPropertyID,
  RDF_PROPERTY as propertyTypeID,
  RDFS_LABEL as labelPropertyID,
  JSON_LD_TYPE as typePropertyID,
  RDFS_SUB_CLASS_OF as subClassOfPropertyID,
} from "./constants";

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

export type EntityProperty = {
  label?: Label;
  values: Array<LabeledEntityValue | LabeledEntityValue[]>;
};

export type Entity = {
  [id: string]: EntityProperty;
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
          label: record.label,
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

/** @todo normalize data to documents with the Compact API of JSON-LD */
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
): Promise<Labeled[]> {
  const result = await runQuery(
    serverURL,
    "gizmo",
    `
  g.addDefaultNamespaces();

  var exactMatchResults = g.V()
    .has(g.IRI("rdfs:label"), "${entityIDPrefix}")
    .save(g.IRI("rdfs:label"), "label")
    .back()
    .limit(${limit});
  
  var labelResults = g.V()
    .out(g.IRI("rdfs:label"))
    .filter(like("${entityIDPrefix}%"))
    .tag("label")
    .back()
    .limit(${limit});
  
  var iriResults = g.V()
    .filter(like("${entityIDPrefix}%"))
    .tag("label")
    .in()
    .limit(${limit});
  
  exactMatchResults
    .union(labelResults)
    .union(iriResults)
    .unique()
    .getLimit(${limit});
    `
  );
  if ("error" in result) {
    throw new Error(result.error);
  }
  const results = result.result || [];
  // @ts-ignore
  return normalizeID(results);
}

export type ClassDescriptor = Labeled & { subClassOf: jsonLd.Reference };

export async function getClasses(
  serverURL: string
): Promise<ClassDescriptor[]> {
  const response: GizmoQueryResponse<{
    id: { "@id": string };
    label: Label;
  }> = await runQuery(
    serverURL,
    "gizmo",
    `
g.addDefaultNamespaces();
g.addNamespace("owl", "http://www.w3.org/2002/07/owl#");

g.V().has(g.IRI("rdf:type"), g.IRI("rdfs:Class")).union(
  g.V().has(g.IRI("rdf:type"), g.IRI("owl:Class"))
)
.saveOpt(g.IRI("rdfs:label"), "label")
.saveOpt(g.IRI("rdfs:subClassOf"), "subClassOf")
.unique()
.getLimit(-1);
  `
  );
  const result = getResult(response);
  const filtered = result?.filter((value) => !value.id["@id"].startsWith("_:"));
  // @ts-ignore
  return normalizeID(filtered) || [];
}

type ClassStatisticsRecord = {
  id: jsonLd.Reference;
  label: jsonLd.Value;
  entitiesCount: number;
};

export type ClassStatistics = Labeled & {
  entitiesCount: number;
};

export async function getClassesStatistics(
  serverURL: string
): Promise<ClassStatistics[]> {
  const query = `
g.addDefaultNamespaces();
g.addNamespace("owl", "http://www.w3.org/2002/07/owl#");

var classes = g.V().has(g.IRI("rdf:type"), g.IRI("rdfs:Class")).union(g.V().has(g.IRI("rdf:type"), g.IRI("owl:Class")));

classes.toArray().forEach(function (cls) {
    var classID = "<" + cls["@id"] + ">";

    var label = g.V(classID).out(g.IRI("rdfs:label")).toValue();

    var entitiesCount = g.V()
        .has(g.IRI("rdf:type"), classID)
        .count();

    g.emit(
        {
            "id": cls,
            "label": label,
            "entitiesCount": entitiesCount
        }
    )
});`;
  const response: GizmoQueryResponse<ClassStatisticsRecord> = await runQuery(
    serverURL,
    "gizmo",
    query
  );
  const result = getResult(response);
  // @ts-ignore
  return normalizeID(result) || [];
}

type ClassInstanceRecord = {
  id: jsonLd.Reference;
  label: jsonLd.Value;
  range: jsonLd.Reference;
};

export type ClassInstanceProperty = Labeled & {
  /** Use range label */
  range: jsonLd.Reference;
};

export async function getClassInstanceProperties(
  serverURL: string,
  classID: string
): Promise<ClassInstanceProperty[]> {
  const query = `
g.addDefaultNamespaces();
g.addNamespace("owl", "http://www.w3.org/2002/07/owl#");

g.V("<${classID}>")
.in(g.IRI("rdfs:domain"))
.saveOpt(g.IRI("rdfs:label"), "label")
.save(g.IRI("rdfs:range"), "range")
.all()
  `;
  const response: GizmoQueryResponse<ClassInstanceRecord> = await runQuery(
    serverURL,
    "gizmo",
    query
  );
  const result = getResult(response);
  // @ts-ignore
  return normalizeID(result) || [];
}

export type Page<T> = { total: number; data: T[] };

export async function getInstancesPage(
  serverURL: string,
  classID: string,
  q: string,
  pageNumber: number,
  pageSize: number
): Promise<Page<Labeled>> {
  const skip = pageNumber * pageSize;
  const query = `
g.addDefaultNamespaces();

var entities = g.V();
var q = ${JSON.stringify(q)};

if (q) {
    var matched = g.V().filter(like("%" + q + "%"))
    entities = matched.union(matched.in(g.IRI("rdfs:label")));
}

var instances = entities.has(g.IRI("rdf:type"), "${escapeID(classID)}")

g.emit(instances.count());

instances
.saveOpt(g.IRI("rdfs:label"), "label")
.unique()
.skip(${skip})
.getLimit(${pageSize});
    `;
  const response = await runQuery(serverURL, "gizmo", query);
  const result = getResult(response);
  const [total, ...items] = result || [];
  return {
    total,
    // @ts-ignore
    data: normalizeID(items) || [],
  };
}

export async function getSubClasses(
  serverURL: string,
  classID: string
): Promise<Labeled[]> {
  const query = `
g.addDefaultNamespaces();

var entities = g.V();

var subClasses = entities.has(g.IRI("rdfs:subClassOf"), "${escapeID(classID)}");

subClasses
.saveOpt(g.IRI("rdfs:label"), "label")
.getLimit(-1);
    `;
  const response = await runQuery(serverURL, "gizmo", query);
  const result = getResult(response);
  // @ts-ignore
  return normalizeID(result || []);
}

/**
 * Get super classes of given class, excluding restrictions.
 */
export async function getSuperClasses(
  serverURL: string,
  classID: string
): Promise<Labeled[]> {
  const query = `
  g.addDefaultNamespaces();
  g.addNamespace("owl", "http://www.w3.org/2002/07/owl#");
  
  var Restriction = g.IRI("owl:Restriction");
  var graphHasRestrictions = g.V(Restriction).count() !== 0;
  
  var entities = g.V();
  
  var superClasses = g.V("${escapeID(classID)}").out(g.IRI("rdfs:subClassOf"));
  
  // Gizmo crashes if calling except with a non-existing IRI.
  // To avoid it except is only called if graphHasRestrictions.
  var filteredSuperClasses = graphHasRestrictions
      ? filteredSuperClasses = (
          superClasses.except(superClasses.has(g.IRI("rdf:type"), Restriction))
      )
      : superClasses;
  
  filteredSuperClasses
  .saveOpt(g.IRI("rdfs:label"), "label")
  .getLimit(-1);
    `;
  const response = await runQuery(serverURL, "gizmo", query);
  const result = getResult(response);
  // @ts-ignore
  return normalizeID(result || []) || [];
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

export function isDatatype(types: Set<string>): boolean {
  return types.has(RDFS_DATATYPE);
}

type NativeIDDescriptor = {
  label: string;
  link: string;
};

const nativeIDDescriptors: { [id: string]: NativeIDDescriptor } = {
  [RDFS_CLASS]: {
    label: "Class",
    link: "https://www.w3.org/TR/rdf-schema/#ch_class",
  },
  [RDF_PROPERTY]: {
    label: "Property",
    link: "https://www.w3.org/TR/rdf-schema/#ch_property",
  },
  [RDFS_LABEL]: {
    label: "Label",
    link: "https://www.w3.org/TR/rdf-schema/#ch_label",
  },
  [RDFS_SUB_CLASS_OF]: {
    label: "Sub Class Of",
    link: "https://www.w3.org/TR/rdf-schema/#ch_subclassof",
  },
  [JSON_LD_TYPE]: {
    label: "Type",
    link: "https://w3c.github.io/json-ld-syntax/#specifying-the-type",
  },
};

export function getNativeIDDescriptor(
  id: string
): NativeIDDescriptor | undefined {
  return nativeIDDescriptors[id];
}
