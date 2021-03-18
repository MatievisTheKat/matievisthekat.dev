import React, { useState, useEffect } from "react";

const Age: React.FC = () => {
  const [age, setAge] = useState("");

  useEffect(() => {
    const int = setInterval(() => {
      const years = Math.round(((new Date().getTime() - new Date(2005, 3, 13).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 1000000000) / 1000000000;
      const decimalPlaces = years.toString().split(".")[1];
      const neededZeros = 9 - decimalPlaces.length;
      const corrected = `${years}${"0".repeat(neededZeros)}`;

      setAge(corrected);
    }, 1);

    return () => {
      clearInterval(int);
    };
  }, []);

  return age ? <>{`${age}`}</> : null;
};

export default Age;
