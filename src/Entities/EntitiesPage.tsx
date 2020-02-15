import React, { useState, useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import "@material/drawer/dist/mdc.drawer.css";

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
      <Drawer>
        <DrawerHeader>
          <Search
            serverURL={serverURL}
            onSelect={goToEntity}
            onError={setError}
          />
        </DrawerHeader>
        <DrawerContent>
          <Classes serverURL={serverURL} onError={setError} />
        </DrawerContent>
      </Drawer>
      <div className="EntitiesPage">
        <Route exact path="/entities">
          Write an entity's IRI in the text box to view the entity
        </Route>
        <Route path="/entities/:entity">
          <EntityPage serverURL={serverURL} onError={setError} error={error} />
        </Route>
      </div>
    </>
  );
};

export default EntitiesPage;
