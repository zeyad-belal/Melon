import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Bookmark = () => {
  return (
    <SafeAreaView className="px-4 py-6 bg-[#000] h-full">
      <Text className="text-2xl text-white font-psemibold">Bookmark</Text>
    </SafeAreaView>
  );
};

export default Bookmark;
