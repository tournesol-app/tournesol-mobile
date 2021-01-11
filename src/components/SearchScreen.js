import React, { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

import YouTube from 'react-native-youtube';

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {
        "count": 212,
        "next": "https://tournesol.app/api/v2/videos/search_tournesol/?backfire_risk=62.5&duration_gte=0&engaging=62.5&importance=62.5&limit=30&offset=30&pedagogy=62.5&reliability=62.5&search=test&views_gte=0",
        "previous": null,
        "results": [
          {
            "id": 10268,
            "video_id": "lG4VkPoG3ko",
            "score": 204.347529262304,
            "name": "The medical test paradox: Can redesigning Bayes rule help?",
            "duration": "00:21:13",
            "language": "en",
            "publication_date": "2020-12-22",
            "views": 381867,
            "uploader": "3Blue1Brown",
            "score_preferences_term": 143.554818630219,
            "score_search_term": 60.7927106320858,
            "rating_n_experts": 4,
            "rating_n_ratings": 32,
            "n_reports": 0,
            "reliability": 2.51296424865723,
            "pedagogy": 2.20081353187561,
            "importance": 2.23387479782104,
            "engaging": 2.03079056739807,
            "backfire_risk": 2.50594234466553
          },
          {
            "id": 153,
            "video_id": "uv88CRhMQq8",
            "score": 156.650357693434,
            "name": "Coronavirus: why you should stay home",
            "duration": "00:10:05",
            "language": "en",
            "publication_date": "2020-03-18",
            "views": 53714,
            "uploader": "Looking Glass Universe",
            "score_preferences_term": 80.6594721972941,
            "score_search_term": 75.9908854961395,
            "rating_n_experts": 2,
            "rating_n_ratings": 12,
            "n_reports": 0,
            "reliability": 1.13855791091919,
            "pedagogy": 1.78727579116821,
            "importance": 0.5874063372612,
            "engaging": 1.22668945789337,
            "backfire_risk": 1.71282827854156
          },
          {
            "id": 190,
            "video_id": "oz1afOJhHOA",
            "score": 147.088234871626,
            "name": "Les tests groupés : dépister plus avec moins !!",
            "duration": "00:25:56",
            "language": "fr",
            "publication_date": "2020-04-27",
            "views": 23233,
            "uploader": "Science4All",
            "score_preferences_term": 58.1113450229167,
            "score_search_term": 88.9768898487091,
            "rating_n_experts": 3,
            "rating_n_ratings": 8,
            "n_reports": 0,
            "reliability": 1.31278002262115,
            "pedagogy": 0.903400659561157,
            "importance": 0.799946129322052,
            "engaging": 0.428927063941956,
            "backfire_risk": 1.20385372638702
          }
        ]
      }
    };
  }

  render() {
    return (
    <View>
      <TextInput
        placeholder="Search on Tournesol"
        onChangeText={() => 42}
      />
      <FlatList
        data={this.state.result.results}
        renderItem={
          ({item}) =>
          <View
            style={{
              flexDirection: "row",
              height: 100,
              padding: 20
            }}
          >
            <YouTube
              videoId={item.video_id}
              apiKey="AIzaSyBYLuyZhqUXsAwdmaBBSHhfV6t9AuM2fgY"
              play={false} // control playback of video with true/false
              fullscreen={false} // control whether the video should play in fullscreen or inline
              loop={false} // control whether the video should loop when ended
              style={{ flex: 0.4 }}
            />
            <Text style={{flex: 0.6}}>
              <Text style={{flexWrap: 'wrap'}}>{item.name}{"\n"}</Text>
              <Text>Score : {item.score.toFixed(0)}</Text>
            </Text>
          </View>
        }
        keyExtractor={item => item.id.toString()}
      />
    </View>)
  }
}
