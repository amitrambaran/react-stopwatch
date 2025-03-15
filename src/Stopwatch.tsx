import React, { useRef, useState, useCallback } from "react";

interface StopwatchProps {
  initialSeconds: number;
}

interface LapProps {
  index: number;
  lap: number;
  onDelete: (index: number) => void;
}

function formattedSeconds(seconds: number) {
  return Math.floor(seconds / 60) + ":" + ("0" + (seconds % 60)).slice(-2);
}

function Stopwatch({ initialSeconds }: StopwatchProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);
  const [lastClearedIncrementer, setLastClearedIncrementer] = useState<
    number | undefined
  >(undefined);
  const [laps, setLaps] = useState<number[]>([]);

  const timerInterval = useRef<number | undefined>(undefined);

  const handleStartClick = useCallback(() => {
    timerInterval.current = setInterval(() => {
      setSecondsElapsed((prevSeconds) => prevSeconds + 1);
    }, 1000);
  }, []);

  const handleStopClick = useCallback(() => {
    clearInterval(timerInterval.current);
    setLastClearedIncrementer(timerInterval.current);
  }, []);

  const handleResetClick = useCallback(() => {
    clearInterval(timerInterval.current);
    setLaps([]);
    setSecondsElapsed(0);
  }, []);

  const handleLapClick = useCallback(() => {
    setLaps((prevLaps) => [...prevLaps, secondsElapsed]);
  }, [secondsElapsed]);

  const handleDeleteClick = useCallback((index: number) => {
    setLaps((prevLaps) => prevLaps.filter((_, i) => index !== i));
  }, []);

  return (
    <div className="stopwatch">
      <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
      {secondsElapsed === 0 ||
      timerInterval.current === lastClearedIncrementer ? (
        <button className="start-btn" onClick={handleStartClick}>
          start
        </button>
      ) : (
        <button className="stop-btn" type="button" onClick={handleStopClick}>
          stop
        </button>
      )}
      {secondsElapsed !== 0 &&
      timerInterval.current !== lastClearedIncrementer ? (
        <button className="lap-btn" onClick={handleLapClick}>
          lap
        </button>
      ) : null}
      {secondsElapsed !== 0 &&
      timerInterval.current === lastClearedIncrementer ? (
        <button className="reset-btn" onClick={handleResetClick}>
          reset
        </button>
      ) : null}
      <div className="stopwatch-laps">
        {laps?.map((lap: number, index: number) => {
          return (
            <Lap
              index={index}
              key={index}
              lap={lap}
              onDelete={handleDeleteClick}
            />
          );
        })}
      </div>
    </div>
  );
}

const Lap = React.memo(({ index, lap, onDelete }: LapProps) => {
  return (
    <div className="stopwatch-lap">
      <strong>{index}</strong>/ {formattedSeconds(lap)}
      <button onClick={() => onDelete(index)}> X </button>
    </div>
  );
});

export default Stopwatch;
