import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch
} from "react-router-dom";
import QueryPage from "./Query/QueryPage";
import DataPage from "./Data/DataPage";
import EntitiesPage from "./Entities/EntitiesPage";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "@material/drawer/dist/mdc.drawer.css";
import logo from "./logo.svg";
import "./App.css";
import "@material/theme/dist/mdc.theme.css";
import SettingsPage from "./SettingsPage";
import useDarkMode from "use-dark-mode";
import usePersistedState from "use-persisted-state";
import { setTheme, Theme } from "./monaco-util";
import("./icon-font");

// window.SERVER_URL can be undefined or empty string. In any of these cases
// it should default.
// @ts-ignore
const SERVER_URL = window.SERVER_URL || "http://localhost:64210";

const Nav = () => {
  const isQuery = useRouteMatch("/query");
  const isData = useRouteMatch("/data");
  const isEntities = useRouteMatch("/entities");
  const isSettings = useRouteMatch("/settings");
  return (
    <Drawer>
      <DrawerHeader>
        <DrawerTitle>
          <img className="Logo" src={logo} alt="logo" />
          Cayley
        </DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <List>
          <Link to="/query">
            <ListItem activated={Boolean(isQuery)}>Query</ListItem>
          </Link>
          <Link to="/data">
            <ListItem activated={Boolean(isData)}>Data</ListItem>
          </Link>
          <Link to="/entities">
            <ListItem activated={Boolean(isEntities)}>Entities</ListItem>
          </Link>
          <Link to="/settings">
            <ListItem activated={Boolean(isSettings)}>Settings</ListItem>
          </Link>
        </List>
      </DrawerContent>
    </Drawer>
  );
};

// eslint-disable-next-line
const useQueryEditorVerticalLayoutState = usePersistedState(
  "query-editor-vertical-layout"
);

function App() {
  const darkMode = useDarkMode();
  const [darkModeEnabled, setDarkModeEnabled] = useState(darkMode.value);
  const [
    queryEditorVerticalLayout,
    setQueryEditorVerticalLayout
  ] = useQueryEditorVerticalLayoutState(false);
  useEffect(() => {
    if (darkModeEnabled) {
      setTheme(Theme.dark);
    } else {
      setTheme(Theme.light);
    }
    if (darkModeEnabled) {
      darkMode.enable();
    } else {
      darkMode.disable();
    }
  }, [darkModeEnabled, darkMode]);

  if (SERVER_URL === undefined) {
    throw new Error(`SERVER_URL environment variable must be provided`);
  }

  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/query">
            <QueryPage
              serverURL={SERVER_URL}
              verticalLayout={queryEditorVerticalLayout}
            />
          </Route>
          <Route path="/data">
            <DataPage serverURL={SERVER_URL} />
          </Route>
          <Route path="/entities">
            <EntitiesPage serverURL={SERVER_URL} />
          </Route>
          <Route path="/settings">
            <SettingsPage
              darkModeEnabled={darkModeEnabled}
              onDarkModeEnabledChange={setDarkModeEnabled}
              queryEditorVerticalLayout={queryEditorVerticalLayout}
              onQueryEditorVerticalLayoutChange={setQueryEditorVerticalLayout}
            />
          </Route>
          <Route path="/">
            <Redirect to="/query" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
