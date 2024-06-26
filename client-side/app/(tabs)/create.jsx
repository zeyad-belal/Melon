import { useState } from "react";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { icons } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user ,getUserPosts } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    description: "",
    image: null,
    keywords: [],
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg","image/jpeg"],
    });
    if (!result.canceled) {
      console.log(selectType)
      if (selectType === "image") {
        setForm({
          ...form,
          image: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (!form.keywords.length || !form.description || !form.image) {
      return Alert.alert("Please provide all fields");
    }
  
    setUploading(true);
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/create`;
  
      const formData = new FormData();
      formData.append("keywords", form.keywords);
      formData.append("description", form.description);
      formData.append("image", form.image);
      formData.append("user_id", user._id);
  
      const requestOptions = {
        method: "POST",
        body: formData,
      };
  
      const response = await fetch(apiUrl, requestOptions);
      if (!response.ok) {
        console.log(response)
        throw new Error('Network response was not ok');
      }
  
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        image: null,
        description: "",
      });
      setUploading(false);
      getUserPosts()
    }
  };
  

  return (
    <SafeAreaView className="bg-[#000] h-[107%]">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Image</Text>

        <FormField
          title="Image description"
          value={form.description}
          placeholder="Give your Image a catchy description..."
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            <View className="w-full h-40 px-4 bg-black rounded-2xl border border-[#252525] flex justify-center items-center">
              <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-1/2 h-1/2"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

            {form.image ? (
        <View className="mt-7 space-y-2">
          <TouchableOpacity onPress={() => openPicker("image")}>
              <Image
                source={{ uri: form.image.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
          </TouchableOpacity>
        </View>
            ) : null}

        <FormField
          title="Keywords"
          value={form.keywords}
          placeholder="The search keywords of your image...."
          handleChangeText={(e) => setForm({ ...form, keywords: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
