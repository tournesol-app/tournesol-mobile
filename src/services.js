export const authenticate = async (username, password) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api-token-auth/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    });
    const json = await response.json();
    console.log(json)
    return json.token;
  } catch (error) {
    // FIXME
    console.error(error);
    throw error;
  }
};