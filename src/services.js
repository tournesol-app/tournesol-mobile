import Config from "react-native-config";

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
      let url = `${Config.BASE_API_URL}${endpoint}`;
      if (params != null) {
        url += `?${new URLSearchParams(params)}`
      }
      const response = await fetch(url, data);
      const json = await response.json();
      if (response.ok) {
        console.log(payload, json);
        return json;
      } else {
        throw new Error(json.toString());
      }
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

  async fetchVideo(video_id) {
    const response = await this.request(
      '/api/v2/videos/search_tournesol/',
      'GET',
      {
        video_id: video_id
      }
    );
    if (response.count == 1) {
      return response.results[0];
    } else {
      console.error(`${response.count} results for video_id=${video_id}`);
    }
  }

  async createVideo(video_id) {
    const response = await this.request(
      '/api/v2/videos/',
      'POST',
      null,
      {
        video_id: video_id
      }
    );
    return response;
  }

  async fetchStatistics() {
    const response = await this.request(
      '/api/v2/statistics/view/',
      'GET',
    );
    return response;
  }

  async sampleVideo() {
    const response = await this.request(
      '/api/v2/expert_ratings/sample_video/',
      'GET'
    );
    return response;
  }

  async sampleVideoWithOther(other_id) {
    const response = await this.request(
      '/api/v2/expert_ratings/sample_video_with_other/',
      'GET',
      {
        video_other: other_id
      }
    );
    return response;
  }

  async fetchConstants() {
    const response = await this.request(
      '/api/v2/constants/view_constants/',
      'GET'
    );
    return response;
  }

  async rateVideos(video1, video2, ratings) {
    const response = await this.request(
      '/api/v2/expert_ratings/',
      'POST',
      null,
      {
        video_1: video1.video_id,
        video_2: video2.video_id,
        ...ratings
      }
    );
    return response;
  }
}
