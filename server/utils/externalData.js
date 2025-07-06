// server/utils/externalData.js
import axios from "axios";

/* ------------------------------------------------------------------
   WEATHER (Open-Meteo) – free, no key required
------------------------------------------------------------------- */
export async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&timezone=UTC&forecast_days=4`; // today + next 3

  const { data } = await axios.get(url);

  const codeToText = (c) =>
    ({
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Freezing drizzle",
      57: "Freezing dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Rain showers",
      81: "Heavy rain showers",
      82: "Violent rain showers",
      85: "Snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Heavy thunderstorm with hail",
    }[c] ?? "Unknown");

  const forecast = [1, 2, 3].map((i) => ({
    dayOffset: i,
    minTempC: data.daily.temperature_2m_min[i],
    maxTempC: data.daily.temperature_2m_max[i],
    condition: codeToText(data.daily.weathercode[i]),
  }));

  return { forecast };
}

/* ------------------------------------------------------------------
   IMAGE (Unsplash) – free tier (50 req/h). Access-Key required.
------------------------------------------------------------------- */
export async function fetchImage(location) {
  const key = process.env.UNSPLASH_KEY;
  if (!key) throw new Error("UNSPLASH_KEY env var missing");

  const url =
    `https://api.unsplash.com/photos/random` +
    `?query=${encodeURIComponent(location)}` +
    `&orientation=landscape&content_filter=high&client_id=${key}`;

  const { data } = await axios.get(url);
  const imageUrl = data.urls.regular; // ~1080 px wide

  await axios.head(imageUrl); // sanity-check 200 OK
  return imageUrl;
}
