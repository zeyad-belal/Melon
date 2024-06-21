import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Alert } from "react-native";

import { icons } from "../../constants";

import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, ImageCard, InfoBox } from "../../components";
import { useEffect, useState } from "react";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [posts, setPosts] = useState([]);

  const logout = async () => {
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  async function getUserPosts() {

    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/user?user_id=${user.id}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      console.log("response from profile", response);

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
  console.log("posts from profile", posts);

  return (
    <SafeAreaView className="bg-[#000] h-[107%]">
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
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subtitle="No posts found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.name}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox title="0" subtitle="Followers" titleStyles="text-xl" />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
