import React, { useState, useEffect } from "react";
import { Labeled } from "./data";
import ID from "./ID";

type Props = {
  title: string;
  query: () => Promise<Labeled[]>;
  onError: (error: Error) => void;
};

const ClassList = ({ title, query, onError }: Props) => {
  const [classes, setClasses] = useState<Labeled[]>([]);
  useEffect(() => {
    query().then(setClasses).catch(onError);
  }, [query, setClasses, onError]);
  if (classes.length === 0) {
    return null;
  }
  return (
    <>
      <h3>{title}</h3>
      {classes.map((labeled) => {
        return (
          <div key={labeled["@id"]}>
            <ID id={labeled["@id"]} label={labeled.label} />
          </div>
        );
      })}
    </>
  );
};

export default ClassList;
