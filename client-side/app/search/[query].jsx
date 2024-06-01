import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, ImageCard, SearchInput } from "../../components";

const Search = () => {
  const { query } = useLocalSearchParams();
  const [ posts, setPosts ] = useState([]);

  async function getSearchPosts() {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}//posts/search`,
        {
          user_id: user.id,
        }
      );
      setPosts(response.data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getSearchPosts();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <ImageCard
            description={item.description}
            image={item.image}
            creator={item.user_id.name}
            avatar={item.user_id.avatar}
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
                <SearchInput initialQuery={query} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
