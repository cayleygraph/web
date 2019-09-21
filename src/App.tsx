import React from "react";
import QueryPage from "./QueryPage";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "@material/drawer/dist/mdc.drawer.css";
import "./App.css";

const SERVER_URL = "http://localhost:64210";

function App() {
  return (
    <div className="App">
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>Cayley</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <List>
            <ListItem activated>Query</ListItem>
            <ListItem>Query Shape</ListItem>
            <ListItem>Visualize</ListItem>
            <ListItem>Write</ListItem>
          </List>
        </DrawerContent>
      </Drawer>
      <QueryPage serverURL={SERVER_URL} />
    </div>
  );
}

export default App;
