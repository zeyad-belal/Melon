import { Alert, Text } from "react-native";
import {  FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, ImageCard } from "../../components";
import { useEffect, useState } from "react";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  console.log("user from bookmark page", user);
  console.log("posts from bookmark page", posts);

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


  async function refetchUser() {
    if(!user.id) return
    const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}`;


    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
  
      const responseData = await response.json();
      console.log("Response:", responseData);
      setPosts(responseData?.user?.saved_items);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  }

  useEffect(() => {
    getPosts();
  }, [user.id]);
  useEffect(() => {
    refetchUser();
  }, []);

  return (
    <SafeAreaView className="px-4 py-6 bg-[#000] h-full">
      <Text className="text-2xl text-white font-psemibold">Bookmark</Text>
      <FlatList
        data={posts?.filter((post) => user.saved_items?.includes(post.id))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            key={item.id}
            id={item.id}
            description={item.description}
            image={item.image}
            creator={item.user_id.name}
            avatar={item.user_id.avatar}
            getPosts={getPosts}
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
