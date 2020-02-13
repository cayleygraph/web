import React, { useState, useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";

import { useHistory } from "react-router-dom";

import Search from "./Search";
import Entity from "./Entity";
import { entityLink, getEntityID } from "./navigation";
import "./EntitiesPage.css";

type Props = {
  serverURL: string;
};

const EntitiesPage = ({ serverURL }: Props) => {
  const history = useHistory();
  const entityID = getEntityID(history.location.pathname);
  const [error, setError] = useState<Error | null>(null);

  const goToEntity = useCallback(
    entityID => {
      history.push(entityLink(entityID));
    },
    [history]
  );

  return (
    <>
      {error && <Snackbar open message={String(error)} />}
      <div className="EntitiesPage">
        <Search
          onSelect={goToEntity}
          onError={setError}
          serverURL={serverURL}
          entityID={entityID}
        />
        <ul>
          {!entityID &&
            "Write an entity's IRI in the text box to view the entity"}
          {entityID && (
            <Entity
              serverURL={serverURL}
              entityID={entityID}
              onError={setError}
              error={error}
            />
          )}
        </ul>
      </div>
    </>
  );
};

export default EntitiesPage;
