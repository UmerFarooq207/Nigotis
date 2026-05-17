export async function createClientInBot(email, password, loginAs = "admin") {
  try {
    // make POST request and get the client id
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `/client/`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            account_type: loginAs,
          }),
        },
      }),
    });

    console.log(response);

    if (!response.ok) {
      console.error("Network response was not ok");
    }
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error creating client in bot:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export async function createNewSession(clientId) {
  try {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `/session/`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            website: true,
            client: clientId,
          }),
        },
      }),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data?.data;
  } catch (error) {
    console.error("Error creating new session in bot:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
