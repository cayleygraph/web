import React, { useEffect } from "react";
import { useTimer } from "use-timer";

type Props = {
  running: boolean;
};

const Timer = ({ running }: Props) => {
  const { time, start, pause, reset } = useTimer({
    interval: 1
  });
  useEffect(() => {
    if (running) {
      reset();
      start();
    } else {
      pause();
    }
  }, [running, reset, start, pause]);
  return (
    <span className="timer">
      {time ? `${formatQueryTime(time)} elapsed` : null}
    </span>
  );
};

export default Timer;

const formatQueryTime = (queryTime: number): string => {
  if (queryTime < 100) {
    return `${queryTime} milliseconds`;
  }
  return `${(queryTime / 1000).toFixed(2)} seconds`;
};
