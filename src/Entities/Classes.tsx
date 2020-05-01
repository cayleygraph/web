import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sortBy from "lodash.sortby";
import { List, ListItem, ListGroup } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { getClasses, ClassDescriptor } from "./data";
import useEntityID from "./useEntityID";
import ID, { getRenderInfo } from "./ID";
import "./Classes.css";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
};

const Classes = ({ serverURL, onError }: Props) => {
  const [classes, setClasses] = useState<ClassDescriptor[]>([]);
  const entityID = useEntityID();

  useEffect(() => {
    getClasses(serverURL).then(setClasses).catch(onError);
  }, [serverURL, setClasses, onError]);

  const orderedClasses = sortClasses(groupClasses(classes));
  return (
    <List className="Classes">
      <Link to="/entities">
        <ListItem activated={entityID === ""}>All</ListItem>
      </Link>
      {orderedClasses.map((record) => {
        if ("subClassOf" in record) {
          return null;
        }
        const classID = record["@id"];
        const Component = (props: Object) => (
          <ListItem {...props} activated={classID === entityID} />
        );
        return (
          <>
            <ID
              key={classID}
              id={classID}
              label={record.label}
              Component={Component}
            />
            {record.subClasses.length > 0 && (
              <ListGroup>
                {record.subClasses.map((subClass) => {
                  const subClassId = subClass["@id"];
                  const Component = (props: Object) => (
                    <ListItem {...props} activated={subClassId === entityID} />
                  );
                  return (
                    <ID
                      key={subClassId}
                      id={subClassId}
                      label={subClass.label}
                      Component={Component}
                    />
                  );
                })}
              </ListGroup>
            )}
          </>
        );
      })}
    </List>
  );
};

export default Classes;

type GroupedClassDescriptor = ClassDescriptor & {
  subClasses: GroupedClassDescriptor[];
};

function groupClasses(classes: ClassDescriptor[]): GroupedClassDescriptor[] {
  const classesById: {
    [key: string]: GroupedClassDescriptor;
  } = {};
  for (const _class of classes) {
    classesById[_class["@id"]] = { ..._class, subClasses: [] };
  }
  for (const _class of classes) {
    if ("subClassOf" in _class) {
      const superClassReferences = Array.isArray(_class.subClassOf)
        ? _class.subClassOf
        : [_class.subClassOf];
      for (const reference of superClassReferences) {
        const superClassId = reference["@id"];
        const superClass = classesById[superClassId];
        if (!superClass) {
          continue;
        }
        classesById[superClassId] = {
          ...superClass,
          subClasses: [...superClass.subClasses, classesById[_class["@id"]]],
        };
      }
    }
  }
  return Object.values(classesById);
}

function sortClasses(
  classes: GroupedClassDescriptor[]
): GroupedClassDescriptor[] {
  return sortBy(classes, (cls) => {
    const info = getRenderInfo(cls["@id"], cls.label);
    const { label } = info;
    if (typeof label === "string") {
      return label;
    }
    return label["@value"];
  });
}
