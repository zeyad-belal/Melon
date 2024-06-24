import { Text } from "react-native";
import { View, Image, FlatList, TouchableOpacity } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, ImageCard } from "../../components";
import { useEffect, useState } from "react";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState([]);



  async function getUserPosts() {

    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/user/${user.id}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          'Authorization':user.token, 
        },
      });

      if (!response.ok) {
        console.log("response from profile", response);
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setPosts(responseData);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  }


  useEffect(() => {
    getUserPosts();
  }, [user.id]);
  return (
    <SafeAreaView className="px-4 py-6 bg-[#000] h-full">
      <Text className="text-2xl text-white font-psemibold">Bookmark</Text>
      <FlatList
        data={posts.filter((post)=>  user.saved_items.includes(post.id))}
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
