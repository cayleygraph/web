import { getLastQuery, setLastQuery } from "./lastQuery";
import { Language } from "../queries";

describe("lastQuery", () => {
  it("Defaults language", () => {
    const lastQuery = getLastQuery();
    expect(lastQuery.language).toBe("gizmo");
  });
  it("Gets default per language", () => {
    const gizmoLastQuery = getLastQuery("gizmo");
    const mqlLastQuery = getLastQuery("mql");
    expect(gizmoLastQuery).not.toBe(mqlLastQuery);
  });
  it("Gets cached", () => {
    const query = {
      language: "gizmo" as Language,
      text: "g.V().out(g.IRI('rdfs:label')).all()"
    };
    setLastQuery(query);
    expect(getLastQuery()).toEqual(query);
  });
  it("Updates cache", () => {
    setLastQuery({
      language: "gizmo" as Language,
      text: "g.V().out(g.IRI('rdfs:label')).all()"
    });
    const query = {
      language: "gizmo" as Language,
      text: "g.V().out(g.IRI('rdfs:subClassOf')).all()"
    };
    setLastQuery(query);
    expect(getLastQuery()).toEqual(query);
  });
  it("Updates cache per language", () => {
    const gizmoQuery = {
      language: "gizmo" as Language,
      text: "g.V().out(g.IRI('rdfs:subClassOf')).all()"
    };
    const mqlQuery = {
      language: "mql" as Language,
      text: '[{"subClassOf": null}]'
    };
    setLastQuery(gizmoQuery);
    setLastQuery(mqlQuery);
    expect(getLastQuery("gizmo")).toEqual(gizmoQuery);
    expect(getLastQuery("mql")).toEqual(mqlQuery);
  });
  it("Updates cached language", () => {
    const gizmoQuery = {
      language: "gizmo" as Language,
      text: "g.V().out(g.IRI('rdfs:subClassOf')).all()"
    };
    const mqlQuery = {
      language: "mql" as Language,
      text: '[{"subClassOf": null}]'
    };
    setLastQuery(gizmoQuery);
    expect(getLastQuery()).toEqual(gizmoQuery);
    setLastQuery(mqlQuery);
    expect(getLastQuery()).toEqual(mqlQuery);
    expect(getLastQuery("gizmo")).toEqual(gizmoQuery);
  });
});
