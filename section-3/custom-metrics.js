import http from "k6/http";
import { sleep } from "k6";
import { Counter, Trend } from "k6/metrics";

// Define the options for the test
export const options = {
  vus: 10, // Number of virtual users to simulate
  duration: "10s", // Duration of the test
  thresholds: {
    // 95% of requests should complete below 4000ms
    http_req_duration: ["p(95)<4000"],

    // The count of 'my_counter' should be more than 10
    my_counter: ["count>10"],

    // 95% of 'response_time_news_page' should be below 3000ms and 99% below 7000ms
    response_time_news_page: ["p(95)<3000", "p(99)<7000"],
  },
};

// Create a new Counter metric named 'my_counter'
let myCounter = new Counter("my_counter");

// Create a new Trend metric named 'response_time_news_page'
let newsPageResponseTrend = new Trend("response_time_news_page");

// This is the main function that will be executed by each virtual user
export default function () {
  // Send a GET request to the base URL
  let res = http.get("https://test.k6.io");
  // Increment 'my_counter' by 1
  myCounter.add(1);
  // Pause for 2 seconds
  sleep(2);

  // Send a GET request to the news page
  res = http.get("https://test.k6.io/news.php");

  // Add the response time of the news page to 'response_time_news_page'
  newsPageResponseTrend.add(res.timings.duration);
  
  // Pause for 1 second
  sleep(1);
}
