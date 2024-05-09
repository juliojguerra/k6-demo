import http, { head } from "k6/http";
import { check } from "k6";

export default function() {

  const credentials = {
    username: `test_${Date.now()}`,
    password: `test_${Date.now()}`,
  }

  http.post(
    "https://test-api.k6.io/user/register/", 
    JSON.stringify(credentials), 
    {
      headers: {
        'Content-Type': 'application/json',
      },  
    });

  let res = http.post(
    "https://test-api.k6.io/auth/token/login/", 
    JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }), 
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  const accessToken = res.json().access;
  console.log(accessToken);

  res = http.get(
    "https://test-api.k6.io/my/crocodiles/",
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  // Create a new crocodile
  const createResponse = http.post(
    "https://test-api.k6.io/my/crocodiles/",
     JSON.stringify({
      "name": "Random croc",
      "sex": "F",
      "date_of_birth": "1934-11-15"
     }),
     {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
     }
  )

  // Check for successful creation (status code 201)
  if (createResponse.status !== 201) {
    throw new Error(`Failed to create crocodile: ${createResponse.status} - ${createResponse.body}`);
  }

  // Extract the ID from the response body based on API structure (adjust as needed)
  const createdCrocodileId = JSON.parse(createResponse.body).id;
  // createResponse.json().body
  
  // Get crocodile by ID
  res = http.get(
    `https://test-api.k6.io/my/crocodiles/${createdCrocodileId}/`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
    "crocodile ID is correct": (r) => r.json().id === createdCrocodileId,
  })

  // Put request
  res = http.put(
    `https://test-api.k6.io/my/crocodiles/${createdCrocodileId}/`,
    JSON.stringify({
      name: "Updated croc name",
      sex: createResponse.json().sex,
      date_of_birth: createResponse.json().date_of_birth,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  // Patch request
  res = http.patch(
    `https://test-api.k6.io/my/crocodiles/${createdCrocodileId}/`,
    JSON.stringify({
      sex: "F"
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  // Delete request
  res = http.del(
    `https://test-api.k6.io/my/crocodiles/${createdCrocodileId}/`,
    null,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );
}