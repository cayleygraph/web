import React, { useState } from "react";
import QueryPage from "./QueryPage";
import QueryShapePage from "./QueryShapePage";
import VisualizePage from "./VisualizePage";
import WritePage from "./WritePage";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "@material/drawer/dist/mdc.drawer.css";
import logo from "./logo.svg";
import "./App.css";

const { REACT_APP_SERVER_URL: SERVER_URL } = process.env;

function App() {
  if (SERVER_URL === undefined) {
    throw new Error(`SERVER_URL environment variable must be provided`);
  }
  /** @todo use router */
  const [page, setPage] = useState("query");
  return (
    <div className="App">
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>
            <img className="Logo" src={logo} alt="logo" />
            Cayley
          </DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <List>
            <ListItem
              onClick={() => setPage("query")}
              activated={page === "query"}
            >
              Query
            </ListItem>
            <ListItem
              activated={page === "queryShape"}
              onClick={() => setPage("queryShape")}
            >
              Query Shape
            </ListItem>
            <ListItem
              activated={page === "visualize"}
              onClick={() => setPage("visualize")}
            >
              Visualize
            </ListItem>
            <ListItem
              activated={page === "write"}
              onClick={() => setPage("write")}
            >
              Write
            </ListItem>
          </List>
        </DrawerContent>
      </Drawer>
      {page === "query" && <QueryPage serverURL={SERVER_URL} />}
      {page === "queryShape" && <QueryShapePage serverURL={SERVER_URL} />}
      {page === "visualize" && <VisualizePage serverURL={SERVER_URL} />}
      {page === "write" && <WritePage serverURL={SERVER_URL} />}
    </div>
  );
}

export default App;
