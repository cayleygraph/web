import React, { useCallback } from "react";
import { IconButton } from "@rmwc/icon-button";
import "@material/icon-button/dist/mdc.icon-button.css";
import "./Paginator.css";

type Props = {
  pageSize: number;
  length?: number;
  onChange: (pageNumber: number) => void;
  value: number;
};

/** A port of https://material.angular.io/components/paginator/overview to React */
const Paginator = ({ pageSize, length, onChange, value }: Props) => {
  const backward = useCallback(() => {
    onChange(value - 1);
  }, [onChange, value]);
  const forward = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);
  const firstItem = value * pageSize + 1;
  const lastItem = Math.min(length || 0, firstItem - 1 + pageSize);
  return (
    <div className="Paginator">
      {firstItem} – {lastItem}
      {length !== undefined && ` of ${length}`}
      <IconButton
        disabled={value === 0}
        icon="keyboard_arrow_left"
        onClick={backward}
      />
      <IconButton
        disabled={lastItem === length}
        icon="keyboard_arrow_right"
        onClick={forward}
      />
    </div>
  );
};

export default Paginator;
