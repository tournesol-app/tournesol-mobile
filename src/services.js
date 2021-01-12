export class APIClient {
  constructor(authToken = null, username = null) {
    this.authToken = authToken;
    this.username = username;
  }
  async request(endpoint, method = "GET", params = null, payload = null) {
    try {
      const data = {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
      if (payload !== null) {
        data['body'] = JSON.stringify(payload);
      }
      if (this.authToken !== null) {
        data['headers']['Authorization'] = `Token ${this.authToken}`;
      }
      let url = `http://127.0.0.1:8000${endpoint}`;
      if (params != null) {
        url += `?${new URLSearchParams(params)}`
      }
      const response = await fetch(url, data);
      const json = await response.json();
      console.log(json)
      return json;
    } catch (error) {
      // FIXME
      console.error(error);
      throw error;
    }
  };

  async authenticate(username, password) {
    const response = await this.request('/api-token-auth/', 'POST', null, {username, password});
    return response.token;
  }

  // https://tournesol.app/api/v2/videos/search_tournesol/?backfire_risk=62.5&diversity_inclusion=62.5&duration_gte=0&engaging=62.5&importance=62.5&layman_friendly=62.5&pedagogy=62.5&reliability=62.5&search=test&views_gte=0
  async search(q) {
    const response = await this.request(
      '/api/v2/videos/search_tournesol/',
      'GET',
      {
        search: q
      }
    );
    return response;
  }

  async myProfile() {
    const response = await this.request(
      '/api/v2/user_information/',
      'GET',
      {
        user__username: this.username
      }
    );
    return response;
  }
}
