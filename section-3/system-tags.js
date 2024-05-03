import http from "k6/http";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<3000"],
    "http_req_duration{status:200}": ["p(95)<1000"],
    "http_req_duration{status:201}": ["p(95)<3000"],
  },
};

export default function () {
  http.get("https://run.mocky.io/v3/c3c0d15e-4329-48fe-9f19-90b7b1e66626");
  http.get(
    "https://run.mocky.io/v3/782b76b7-3160-4997-bfb3-9603806dd9df?mocky-delay=2000ms"
  );
}
