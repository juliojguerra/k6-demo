// Import the http module from k6 for making HTTP requests
import http from "k6/http";

// Import the Counter module from k6/metrics to create a custom counter
import { Counter } from "k6/metrics";

// Import the check and sleep functions from k6
import { check, sleep } from "k6";

// Define the options for the test
export const options = {
  thresholds: {
    // 95% of requests should complete below 300ms
    http_req_duration: ["p(95)<300"],

    // 95% of requests to the 'order' page should complete below 250ms
    "http_req_duration{page:order}": ["p(95)<250"],

    // There should be no http errors
    http_errors: ["count==0"],

    // There should be no http errors on the 'order' page
    "http_errors{page:order}": ["count==0"],

    // At least 99% of checks should pass
    checks: ["rate>=0.99"],

    // At least 99% of checks on the 'order' page should pass
    "checks{page:order}": ["rate>=0.99"],
  },
};

// Create a new Counter metric named 'http_errors'
let httpErrors = new Counter("http_errors");
