import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch
} from "react-router-dom";
import QueryPage from "./QueryPage";
import DataPage from "./DataPage";
import EntitiesPage from "./Entities/EntitiesPage";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "@material/drawer/dist/mdc.drawer.css";
import logo from "./logo.svg";
import "./App.css";
import("./icon-font");

const { REACT_APP_SERVER_URL: SERVER_URL } = process.env;

const Nav = () => {
  const isQuery = useRouteMatch("/query");
  const isData = useRouteMatch("/data");
  const isEntities = useRouteMatch("/entities");
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
        </List>
      </DrawerContent>
    </Drawer>
  );
};

function App() {
  if (SERVER_URL === undefined) {
    throw new Error(`SERVER_URL environment variable must be provided`);
  }

  return (
    <Router>
      <div className="App">
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
          <Route path="/">
            <Redirect to="/query" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
