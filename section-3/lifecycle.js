import { sleep } from "k6";
import http from "k6/http";

// Here we set how many virtual users (vus) we want to pretend to be visiting our website and for how long.
export const options = {
  vus: 2, // This means we have 2 virtual users.
  duration: "5s", // They will keep visiting the website for 5 seconds.
};

console.log("-- init stage --");

// This is the main part of our script where each virtual user does something.
export default function () {
  console.log("-- VU stage --");
  // Wait for 1 second because maybe our virtual users are tired and need a little rest!
  sleep(1);
}

// This function sets up everything before the virtual users start visiting.
export function setup() {
  console.log("-- setup stage --");
  sleep(10); // We wait for 10 seconds to make sure everything is ready before the virtual users start.

  // We create some data to use later, here it's just an example.
  const data = { foo: "bar" };
  return data; // We send this data to the main function to use it.
}

// This function cleans up everything after the virtual users are done visiting.
export function teardown() {
  console.log("-- teardown stage --"); 
}
