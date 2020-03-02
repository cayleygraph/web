import React from "react";
import ContentLoader from "react-content-loader";
import "./EntityLoading.css";

// A rectangle illustration of the entity view
export const EntityLoading = () => (
  <ContentLoader className="EntityLoading" viewBox="0 0 510 906">
    {/* Only SVG elements */}
    <rect x="0" y="35" width="52" height="23" />
    <rect x="0" y="80" width="692" height="38" />
    <rect x="0" y="142" width="407" height="32" />
    <rect x="0" y="201" width="86" height="18" />
    <rect x="90" y="201" width="53" height="18" />
    <rect x="0" y="221" width="86" height="18" />
    <rect x="90" y="221" width="53" height="18" />
    <rect x="0" y="241" width="86" height="18" />
    <rect x="90" y="241" width="53" height="18" />
    <rect x="0" y="261" width="86" height="18" />
    <rect x="90" y="261" width="53" height="18" />
    <rect x="0" y="281" width="86" height="18" />
    <rect x="90" y="281" width="53" height="18" />
    <rect x="0" y="301" width="86" height="18" />
    <rect x="90" y="301" width="53" height="18" />
  </ContentLoader>
);
