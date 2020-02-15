import { useRouteMatch } from "react-router-dom";

const useEntityID = (): string | undefined => {
  const match = useRouteMatch<{ entity: string }>("/entities/:entity");
  const encoded = match?.params?.entity;
  return encoded && decodeURIComponent(encoded);
};

export default useEntityID;
