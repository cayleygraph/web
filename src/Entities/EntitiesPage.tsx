import React, { useState, useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";

import { useHistory, Route } from "react-router-dom";

import Search from "./Search";
import EntityPage from "./EntityPage";
import Classes from "./Classes";
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
      <Classes serverURL={serverURL} entityID={entityID} />
      <div className="EntitiesPage">
        <Search
          serverURL={serverURL}
          onSelect={goToEntity}
          onError={setError}
          entityID={entityID}
        />
        <Route exact path="/entities">
          Write an entity's IRI in the text box to view the entity
        </Route>
        <Route path="/entities/:entity">
          <EntityPage
            serverURL={serverURL}
            entityID={entityID}
            onError={setError}
            error={error}
          />
        </Route>
      </div>
    </>
  );
};

export default EntitiesPage;
