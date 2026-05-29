export function extractDateTime(timestamp: string) {
  //   const [date, timeWithZone] = timestamp.split("T");
  //   const time = timeWithZone.split(".")[0];

  //   return { date, time };

  const dateObj = new Date(timestamp);
  const date = dateObj.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  const time = dateObj.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  return { date, time };
}
