import { Text } from "react-native";
import { View, Image, FlatList, TouchableOpacity } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState } from "../../components";

const Bookmark = () => {
  console.log('user')
  const { user } = useGlobalContext();
  console.log('user',user)
  return (
    <SafeAreaView className="px-4 py-6 bg-[#000] h-full">
      <Text className="text-2xl text-white font-psemibold">Bookmark</Text>
      <FlatList
        data={user.saved_items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            key={item.id}
            id={item.id}
            description={item.description}
            image={item.image}
            creator={item.user_id.name}
            avatar={item.user_id.avatar}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subtitle="No Posts Were Bookmarked Yet"
          />
        )}

      />
   
    </SafeAreaView>
  );
};
 
export default Bookmark;
