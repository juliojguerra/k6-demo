// Here we import necessary tools from the k6 library to help us with HTTP requests and organizing our test
import http from "k6/http";
import { group, check } from "k6";

// We're setting up the rules for our test, like how fast our website should respond
export const options = {
  thresholds: {
    // 95% of all requests should be faster than 1000 milliseconds (1 second)
    http_req_duration: ["p(95)<1000"],
    // 95% of requests that we expect a specific response from should be faster than 5000 milliseconds (5 seconds)
    "http_req_duration{expected_response:true}": ["p(95)<5000"],
    // 95% of the total time spent on the "Main page" group should be less than 3000 milliseconds
    "group_duration{group:::Main page}": ["p(95)<3000"],
    // 95% of the total time spent on the "Assets" group inside the "Main page" should be less than 1000 milliseconds
    "group_duration{group:::Main page::Assets}": ["p(95)<1000"],
    // 95% of the total time spent on the "News page" group should be less than 1000 milliseconds
    "group_duration{group:::News page}": ["p(95)<1000"],
  },
};

// This is the main function where we define what the test actually does
export default function () {
  // We group some tests under the name "Main page"
  group("Main page", function () {
    // We make an HTTP GET request to a specified URL and store the result in `res`
    let res = http.get(
      "https://run.mocky.io/v3/0089d84a-13c7-489d-8517-d3a0122cd61b"
    );
    // We check that the response status from our HTTP request is 200 (OK)
    check(res, { "status is 200": (r) => r.status === 200 });

    // We define a sub-group called "Assets" where we perform more HTTP GET requests
    group("Assets", function () {
      http.get("https://run.mocky.io/v3/0089d84a-13c7-489d-8517-d3a0122cd61b");
      http.get("https://run.mocky.io/v3/0089d84a-13c7-489d-8517-d3a0122cd61b");
    });
  });

  // We define another group of tests under the name "News page"
  group("News page", function () {
    // Another HTTP GET request to a different URL
    http.get("https://run.mocky.io/v3/d86a8b2a-54ad-44d2-b5ee-5d53c3aaf52b");
  });
}
