const ONE_HOUR_MS = 3_600_000;

type CityTimezone = {
  city: string;
  gmt: string;
};

const cityTimezones: CityTimezone[] = [
  { city: "Los Angeles", gmt: "-08:00" },
  { city: "New York", gmt: "-05:00" },
  { city: "Caracas", gmt: "-04:30" },
  { city: "Buenos Aires", gmt: "-03:00" },
  { city: "London", gmt: "00:00" },
  { city: "Rome", gmt: "+01:00" },
  { city: "Moscow", gmt: "+03:00" },
  { city: "Tehran", gmt: "+03:30" },
  { city: "New Delhi", gmt: "+05:30" },
  { city: "Beijing", gmt: "+08:00" },
  { city: "Canberra", gmt: "+10:00" },
];

function timeDifference(cityA: string, timestamp: string, cityB: string) {
  const timestampInMs = new Date(timestamp).getTime();

  const cityATimezoneOffset = getCityTimezoneOffset(cityA);
  const cityBTimezoneOffset = getCityTimezoneOffset(cityB);

  const adjustedTimestamp =
    timestampInMs + Number(cityBTimezoneOffset) - Number(cityATimezoneOffset);

  const adjustedTimestampDate = new Date(adjustedTimestamp)
    .toISOString()
    .split("T");

  const [year, month, day] = adjustedTimestampDate[0].split("-");
  const hour = adjustedTimestampDate[1].slice(0, -8);

  return `${year}-${+month}-${+day} ${hour}`;
}

function getCityTimezoneOffset(city: CityTimezone["city"]): number {
  const timezone = cityTimezones.find((i) => i.city === city)?.gmt;

  if (!timezone) {
    throw new Error(`Timezone not found for city: ${city}`);
  }

  const [hours, minutes = 0] = timezone.slice(1).split(":").map(Number);

  const totalOffset = hours * ONE_HOUR_MS + minutes * 60 * 1000;

  return timezone.startsWith("-") ? -totalOffset : totalOffset;
}

timeDifference("Los Angeles", "April 1, 2011 23:23", "Canberra");
// "2011-4-2 17:23",
// "Example #1";

timeDifference("London", "July 31, 1983 23:01", "Rome");
//   "1983-8-1 00:01",
//   "Example #2";

// timeDifference("New York", "December 31, 1970 13:40", "Beijing")
//   "1971-1-1 02:40",
//   "Example #3";
