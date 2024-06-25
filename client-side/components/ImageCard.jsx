import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";

import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";

const ImageCard = ({ id, description, creator, avatar, image, getPosts }) => {
  const { user } = useGlobalContext();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(user.saved_items?.includes(id));
  }, [user, user.saved_items]);

  const bookmarkPost = async () => {
    if (!user.id) return;
    setSaved(true);
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saved_items: [...user.saved_items, id],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      setSaved(false);
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      getPosts();
    }
  };

  const unBookmarkPost = async () => {
    if (!user.id) return;
    setSaved(false);
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saved_items: user.saved_items?.filter((item) => item !== id),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      setSaved(true);
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      getPosts();
    }
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14" key={id}>
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {description}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          {saved ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={unBookmarkPost}
              className="w-full h-6 rounded-xl relative flex justify-center items-center"
            >
              <Image
                source={icons.saved}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={bookmarkPost}
              className="w-full h-6 rounded-xl relative flex justify-center items-center"
            >
              <Image
                source={icons.save}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {}}
        className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
      >
        <Image
          source={{ uri: image.url }}
          className="w-full h-full rounded-xl mt-3"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageCard;
