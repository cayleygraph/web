import React from "react";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

const RunButton = ({ onClick }: { onClick: () => void }) => (
  <Button icon="play_circle_filled" unelevated label="Run" onClick={onClick} />
);

export default RunButton;
