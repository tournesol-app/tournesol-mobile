import {colors} from 'react-native-elements'

colors.primary = '#fdd835';
colors.secondary = '#ff6347';
colors.background = '#ffffff';

const theme = {
  colors,
  Badge: {
    badgeStyle: {
      backgroundColor: colors.primary,
    },
    textStyle: {
      color: colors.grey0,
    }
  },
  Button: {
    buttonStyle: {
      backgroundColor: colors.primary,
    },
    titleStyle: {color: colors.secondary},
  },
  Slider: {
    minimumTrackTintColor: colors.primary,
    trackStyle: {
      height: 14,
      borderRadius: 2,
      backgroundColor: 'white',
      borderColor: '#9a9a9a',
      borderWidth: 1,
    },
    thumbStyle: {
      width: 20,
      height: 20,
      borderRadius: 2,
      backgroundColor: '#eaeaea',
      borderColor: '#9a9a9a',
      borderWidth: 1,
    }
  }
};

export default theme;
