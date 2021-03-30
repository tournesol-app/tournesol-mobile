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

  userPreferences() {
    return this.request(
      '/api/v2/user_preferences/my/',
      'GET'
    );
  }

  userPreferencesUpdate(preferences) {
    return this.request(
      '/api/v2/user_preferences/my/',
      'PATCH',
      null,
      preferences
    );
  }

  searchVideos(filters, link = null) {
    return (link == null) ?
      this.request(
        '/api/v2/videos/search_tournesol/',
        'GET',
        filters
      )
    : fetch(link, {headers: {Authorization: `Token ${this.authToken}`}});
  }

  fetchVideo(video_id) {
    return this.request(
      '/api/v2/videos/',
      'GET',
      { video_id }
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

  sampleFirstVideo() {
    return this.request(
      '/api/v2/expert_ratings/sample_first_video/',
      'GET'
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

  fetchRateLater() {
    return this.request(
      '/api/v2/rate_later/',
      'GET'
    );
  }

  addToRateLater(video_id) {
    return this.request(
      '/api/v2/rate_later/',
      'POST',
      null,
      {
        video: video_id
      }
    );
  }
}
