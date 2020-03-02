import { useState, useEffect, useCallback } from "react";
import { Theme as SelectTheme } from "react-select";
import useDarkMode from "use-dark-mode";

const LIGHT_COLORS = {
  BACKGROUND: `#fff`,
  LIST_ITEM_HOVER: `rgba(0, 0, 0, 0.04)`,
  LIST_ITEM_ACTIVE: `rgba(0, 0, 0, 0.10)`,
  PRIMARY: `rgb(106, 61, 232)`,
  TEXT_COLOR: "#333",
  CHEVRON_COLOR: "rgb(0, 0, 0, 0.2)",
  ACTIVE_CHEVRON_COLOR: "rgb(0, 0, 0, 0.5)"
};

const DARK_COLORS = {
  BACKGROUND: `#000`,
  LIST_ITEM_HOVER: `rgba(255, 255, 255, 0.04)`,
  LIST_ITEM_ACTIVE: `rgba(255, 255, 255, 0.10)`,
  PRIMARY: `#bb86fc`,
  TEXT_COLOR: "#fff",
  CHEVRON_COLOR: "rgb(255, 255, 255, 0.2)",
  ACTIVE_CHEVRON_COLOR: "rgb(255, 255, 255, 0.5)"
};

function getColors(darkModeEnabled: boolean) {
  if (darkModeEnabled) {
    return DARK_COLORS;
  } else {
    return LIGHT_COLORS;
  }
}

export const useColors = () => {
  const darkMode = useDarkMode();
  const [colors, setColors] = useState(getColors(darkMode.value));
  useEffect(() => {
    setColors(getColors(darkMode.value));
  }, [darkMode.value, setColors]);
  return colors;
};

export const useSelectTheme = () => {
  const colors = useColors();
  return useCallback(
    (theme: SelectTheme): SelectTheme => ({
      ...theme,
      colors: {
        ...theme.colors,
        neutral0: colors.BACKGROUND,
        neutral20: colors.CHEVRON_COLOR,
        neutral50: colors.ACTIVE_CHEVRON_COLOR,
        neutral80: colors.TEXT_COLOR,
        primary: colors.PRIMARY,
        primary25: colors.LIST_ITEM_HOVER,
        primary50: colors.LIST_ITEM_ACTIVE
      }
    }),
    [colors]
  );
};
