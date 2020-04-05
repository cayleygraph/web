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
import { entityLink } from "./navigation";
import "./EntitiesPage.css";
import Dashboard from "./Dashboard";

type Props = {
  serverURL: string;
};

const EntitiesPage = ({ serverURL }: Props) => {
  const history = useHistory();
  const [error, setError] = useState<Error | null>(null);

  const goToEntity = useCallback(
    (entityID) => {
      history.push(entityLink(entityID));
    },
    [history]
  );

  return (
    <>
      {error && <Snackbar open message={String(error)} />}
      <Drawer className="ClassesDrawer">
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
          <Dashboard serverURL={serverURL} />
        </Route>
        <Route path="/entities/:entity">
          <EntityPage serverURL={serverURL} setError={setError} error={error} />
        </Route>
      </div>
    </>
  );
};

export default EntitiesPage;
