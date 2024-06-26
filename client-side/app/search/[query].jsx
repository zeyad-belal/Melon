import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, ImageCard, SearchInput } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Search = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);

  const getSearchPosts = async () => {
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/search/${query}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("response from search", response);

      const responseData = await response.json();
      setPosts(responseData);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };
  // bad approach need to be fixed 
  async function getPosts() {
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: user.token,
        },
      });

      if (!response.ok) {
        console.log("response from bookmarked", response);
        return;

        // throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setPosts(responseData);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  }
  useEffect(() => {
    getSearchPosts();
  }, [query]);
  console.log("posts from search", posts);
  // console.log('user',user)
  return (
    <SafeAreaView className="bg-[#000] h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            key={item.id}
            id={item.id}
            description={item.description}
            image={item.image}
            creator={item.user_id.name}
            avatar={item.user_id.avatar}
            keywords={item.keywords}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subtitle="No posts found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
