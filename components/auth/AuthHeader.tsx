import { Fonts } from '@/constants/theme';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

interface AuthHeaderProps {
  imageSource: ImageSourcePropType;
  heading: string;
  subheading: string;
}

export default function AuthHeader({ imageSource, heading, subheading }: AuthHeaderProps) {
  return (
    <View className="mb-6 items-center">
      <Image className="mb-5 h-12 w-24" resizeMode="contain" source={imageSource} />

      <Text
        className="text-center text-3xl font-bold text-[#1A1A1A]"
        style={{ fontFamily: Fonts.sans }}
      >
        {heading}
      </Text>

      <Text
        className="mt-2 text-center text-base text-[#666666]"
        style={{ fontFamily: Fonts.sans }}
      >
        {subheading}
      </Text>
    </View>
  );
}