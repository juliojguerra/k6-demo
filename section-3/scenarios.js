// Import necessary modules from k6
import http from "k6/http";
import { check } from "k6";
import { sleep } from "k6";
import exec from "k6/execution";

// Define the options for the test
export const options = {
  vus: 10, // Number of virtual users to simulate
  duration: "10s", // Duration of the test
  thresholds: {
    http_req_duration: ["p(95)<300"], // 95% of requests should complete below 400ms
    http_req_duration: ["max<2000"],
    http_req_failed: ["rate<0.1"], // Uncomment this line if you want to ensure less than 1% of requests fail
    http_reqs: ["count>20"], // There should be more than 20 requests
    http_reqs: ["rate>4"], // The rate of requests should be more than 4 per second
    vus: ["value >= 1"],
    checks: ["rate>=0.98"],
  },
};

// This is the main function that will be executed by each virtual user
export default function () {
  // Send a GET request
  const res = http.get(
    "https://test.k6.io" + (exec.scenario.iterationInTest === 1 ? "foo" : "")
  );
  //console.log(exec.scenario.iterationInTest);

  // Check the response
  check(res, {
    "status is 200": (r) => r.status === 200, // The status code should be 200
    "page is startpage": (r) =>
      r.body.includes("Collection of simple web-pages"), // The response body should include this text
  });

  // Pause for 2 seconds
  sleep(2);
}
