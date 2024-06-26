import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
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
        return
        // throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setUserPosts(responseData);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  }
  
  useEffect(()=>{
    fetchPosts()
    getUserPosts()
  },[user])

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        posts,
        setPosts,
        fetchPosts,
        userPosts,
        getUserPosts
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
