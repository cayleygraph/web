import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch
} from "react-router-dom";
import QueryPage from "./Query/QueryPage";
import DataPage from "./DataPage";
import EntitiesPage from "./Entities/EntitiesPage";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "@material/drawer/dist/mdc.drawer.css";
import logo from "./logo.svg";
import "./App.css";
import "@material/theme/dist/mdc.theme.css";
import classNames from "classnames";
import SettingsPage from "./SettingsPage";
import { setTheme } from "./monaco-util";
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

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  if (SERVER_URL === undefined) {
    throw new Error(`SERVER_URL environment variable must be provided`);
  }

  useEffect(() => {
    if (darkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={classNames("App", { "dark-mode": darkMode })}>
        <Nav />
        <Switch>
          <Route path="/query">
            <QueryPage serverURL={SERVER_URL} />
          </Route>
          <Route path="/data">
            <DataPage serverURL={SERVER_URL} />
          </Route>
          <Route path="/entities">
            <EntitiesPage serverURL={SERVER_URL} />
          </Route>
          <Route path="/settings">
            <SettingsPage onDarkModeChange={setDarkMode} darkMode={darkMode} />
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
