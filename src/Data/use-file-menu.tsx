import React, { ReactNode, useCallback, useRef } from "react";

type OnChange = (files: File[]) => void;

type Open = () => void;

export const useFileMenu = (onChange: OnChange): [ReactNode, Open] => {
  const ref = useRef<HTMLInputElement>(null);
  const open = useCallback(() => {
    const input = ref.current;
    if (input) {
      input.click();
    }
  }, [ref]);
  const handleChange = useCallback(
    event => {
      onChange(event.target.files);
    },
    [onChange]
  );
  const input = (
    <input
      type="file"
      ref={ref}
      style={{ display: "none" }}
      onChange={handleChange}
    />
  );
  return [input, open];
};
