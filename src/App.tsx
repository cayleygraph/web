import React, { useState } from "react";
import QueryPage from "./QueryPage";
import VisualizePage from "./VisualizePage";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "@material/drawer/dist/mdc.drawer.css";
import "./App.css";

const SERVER_URL = "http://localhost:64210";

function App() {
  /** @todo use router */
  const [page, setPage] = useState("query");
  return (
    <div className="App">
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>Cayley</DrawerTitle>
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
      {page === "visualize" && <VisualizePage serverURL={SERVER_URL} />}
    </div>
  );
}

export default App;
