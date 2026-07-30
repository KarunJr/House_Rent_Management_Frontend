import { Fonts } from '@/constants/theme';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

interface AuthHeaderProps {
  imageSource: ImageSourcePropType;
  heading: string;
  subheading: string;
}

export default function AuthHeader({ imageSource, heading, subheading }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <Image style={styles.logo} source={imageSource} />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subheading}>{subheading}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    color: '#1A1A1A',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    fontFamily: Fonts.sans,
    color: '#666',
  },
});
