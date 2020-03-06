import React, { useState, useEffect } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import sortBy from "lodash.sortby";
import { getClassesStatistics, ClassStatistics } from "./data";
import { entityLink } from "./navigation";
import EntityValue from "./EntityValue";
import "./Dashboard.css";
import { Link } from "react-router-dom";

function formatNumber(number: number): string {
  const numberFormat = new Intl.NumberFormat(undefined, {
    // @ts-ignore
    notation: "compact",
    compactDisplay: "short"
  });
  return numberFormat.format(number);
}

type Props = {
  serverURL: string;
};

const Dashboard = ({ serverURL }: Props) => {
  const [error, setError] = useState();
  const [classesStatistics, setClassesStatistics] = useState<ClassStatistics[]>(
    []
  );
  useEffect(() => {
    getClassesStatistics(serverURL)
      .then(setClassesStatistics)
      .catch(setError);
  }, [serverURL, setClassesStatistics, setError]);

  const sortedClassesStatistics = sortBy(
    classesStatistics,
    stats => stats.entitiesCount
  ).reverse();

  return (
    <div className="Dashboard">
      {error && <Snackbar open message={String(error)} />}
      {sortedClassesStatistics.map(stats => {
        return (
          <Link key={stats["@id"]} to={entityLink(stats["@id"])}>
            <Card>
              <Typography use="subtitle1">
                <EntityValue value={stats} label={stats.label} />
              </Typography>
              <Typography use="headline5">
                {formatNumber(stats.entitiesCount)}
              </Typography>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default Dashboard;
