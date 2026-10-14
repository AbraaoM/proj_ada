import { createServer } from "node:http";

const body = JSON.stringify({
  current: {
    time: "2026-10-13T14:00",
    temperature_2m: 22,
    apparent_temperature: 21,
    wind_speed_10m: 12,
    precipitation: 0,
    rain: 0,
    weather_code: 1,
  },
});

const server = createServer((request, response) => {
  if (!request.url?.startsWith("/v1/forecast")) {
    response.writeHead(404);
    response.end();
    return;
  }

  response.writeHead(200, { "content-type": "application/json" });
  response.end(body);
});

server.listen(4010);
