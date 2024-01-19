import React, { useEffect, useState } from "react";

const Stopwatch = ({ liveTimestamp }) => {
  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateRemainingTime = () => {
      const targetDate = new Date(liveTimestamp);

      // Check if targetDate is a valid date
      if (isNaN(targetDate.getTime())) {
        console.error("Invalid Date Format:", liveTimestamp);
        return;
      }

      const currentDate = new Date();

      const timeDifference = targetDate - currentDate;

      if (timeDifference > 0) {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setRemainingTime({ hours, minutes, seconds });
      } else {
        // The target time has already passed
        setRemainingTime({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const intervalId = setInterval(calculateRemainingTime, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [liveTimestamp]);

  const getColorClass = (value) => {
    if (value <= 10) {
      return "text-red-500";
    } else if (value <= 30) {
      return "text-yellow-500";
    } else {
      return "text-green-500";
    }
  };

  return (
    <div className="fixed top-0 right-0 m-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Remaining Time</h2>
      <p>
        <span className={`${getColorClass(remainingTime.hours)} font-bold`}>
          {remainingTime.hours} hours
        </span>
        <span className="mx-2 text-gray-600">:</span>
        <span className={`${getColorClass(remainingTime.minutes)} font-bold`}>
          {remainingTime.minutes} minutes
        </span>
        <span className="mx-2 text-gray-600">:</span>
        <span className={`${getColorClass(remainingTime.seconds)} font-bold`}>
          {remainingTime.seconds} seconds
        </span>
      </p>
    </div>
  );
};

export default Stopwatch;
