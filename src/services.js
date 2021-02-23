import Config from "react-native-config";

export class APIClient {
  constructor(authToken = null, username = null) {
    this.authToken = authToken;
    this.username = username;
  }
  request(endpoint, method = "GET", params = null, payload = null) {
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
      return fetch(url, data);
    } catch (error) {
      // FIXME
      console.error(error);
      throw error;
    }
  };

  authenticate(username, password) {
    return this.request('/api-token-auth/', 'POST', null, {username, password});
  }

  myProfile() {
    return this.request(
      '/api/v2/user_information/',
      'GET',
      {
        user__username: this.username
      }
    );
  }

  // https://tournesol.app/api/v2/videos/search_tournesol/?backfire_risk=62.5&diversity_inclusion=62.5&duration_gte=0&engaging=62.5&importance=62.5&layman_friendly=62.5&pedagogy=62.5&reliability=62.5&search=test&views_gte=0
  searchVideos(filters) {
    return this.request(
      '/api/v2/videos/search_tournesol/',
      'GET',
      filters
    );
  }

  createVideo(video_id) {
    return this.request(
      '/api/v2/videos/',
      'POST',
      null,
      {
        video_id: video_id
      }
    );
  }

  fetchStatistics() {
    return this.request(
      '/api/v2/statistics/view/',
      'GET',
    );
  }

  sampleVideo() {
    return this.request(
      '/api/v2/expert_ratings/sample_video/',
      'GET'
    );
  }

  sampleVideoWithOther(other_id) {
    return this.request(
      '/api/v2/expert_ratings/sample_video_with_other/',
      'GET',
      {
        video_other: other_id
      }
    );
  }

  fetchConstants() {
    return this.request(
      '/api/v2/constants/view_constants/',
      'GET'
    );
  }

  rateVideos(video1, video2, ratings) {
    return this.request(
      '/api/v2/expert_ratings/',
      'POST',
      null,
      {
        video_1: video1.video_id,
        video_2: video2.video_id,
        ...ratings
      }
    );
  }
}
