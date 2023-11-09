import { useState, useEffect } from 'react';

const useCountdown = () => {
    const [availEpoch, setAvailEpoch] = useState(0);
    const [dateTime, setDateTime] = useState("");
    let timeout;
  
    useEffect(() => {
        if (availEpoch === 0 || dateTime === "Name Available!") return;
        if (dateTime === ""){
            const curEpoch = new Date().getTime();
            const timeOffset = availEpoch - curEpoch;
            if (timeOffset <= 0) {
                setDateTime("Name Available!");
                return;
            } else {
                setDateTime(formatDuration(timeOffset));
            }
        }
        else{
            timeout = setTimeout(() => {
                const curEpoch = new Date().getTime();
                const timeOffset = availEpoch - curEpoch;
                if (timeOffset <= 0) {
                    setDateTime("Name Available!");
                    return;
                  } else {
                    setDateTime(formatDuration(timeOffset));
                  }
            }, 1000);
        }
        return () => clearTimeout(timeout);
    }, [availEpoch, dateTime]);
    
    const start = (millis) => {
        setAvailEpoch(millis);
    };

    const stop = () => {
        clearTimeout(timeout);
        setAvailEpoch(0);
        setDateTime("");
    };
    function formatDuration(milliseconds) {
        const millisecondsPerSecond = 1000;
        const millisecondsPerMinute = millisecondsPerSecond * 60;
        const millisecondsPerHour = millisecondsPerMinute * 60;
        const millisecondsPerDay = millisecondsPerHour * 24;
      
        const days = Math.floor(milliseconds / millisecondsPerDay);
        milliseconds %= millisecondsPerDay;
      
        const hours = Math.floor(milliseconds / millisecondsPerHour);
        milliseconds %= millisecondsPerHour;
      
        const minutes = Math.floor(milliseconds / millisecondsPerMinute);
        milliseconds %= millisecondsPerMinute;
      
        const seconds = Math.floor(milliseconds / millisecondsPerSecond);
        milliseconds %= millisecondsPerSecond;
      
        // Create the formatted string
        let formattedDuration = '';
      
        if (days > 0) {
          formattedDuration += `${days}d `;
        }
      
        if (hours > 0) {
          formattedDuration += `${hours}h `;
        }
      
        if (minutes > 0) {
          formattedDuration += `${minutes}m `;
        }
      
        formattedDuration += `${seconds.toString().padStart(2, '0')}s`;
      
        return formattedDuration.trim(); // Remove trailing whitespace
      }

    return {
    dateTime,
    start,
    stop
  };
}

export default useCountdown