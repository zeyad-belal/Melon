import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-[#000] h-full">
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logoAndName}
            className="w-[190px] h-[94px]" 
            resizeMode="contain"
          />

          {/* <Image
            source={images.mainLogo}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          /> */}

          <View className="relative mt-5">
          <Text className="text-3xl text-white font-bold text-center">
              Unleash Your Voice{"\n"}
              With{" "}
              <Text className="text-secondary-200">Melon</Text>
            </Text>


          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Embark on a Journey of Limitless
            Exploration with Melon
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
