import React, { useEffect, useRef } from "react";
import { useTimer } from "use-timer";

type Props = {
  running: boolean;
};

const Timer = ({ running }: Props) => {
  const lastRunning = useRef<boolean>(false);
  const { time, start, pause, reset } = useTimer({
    interval: 1
  });

  useEffect(() => {
    if (lastRunning.current !== running) {
      lastRunning.current = running;
      if (running) {
        reset();
        start();
      } else {
        pause();
      }
    }
  }, [lastRunning, running, reset, start, pause]);

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
