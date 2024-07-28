import { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { API_URL } from "../../config/global";

const fetchUser = async (url) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo ? userInfo.token : null;
    const config = token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : null;
    if (token) {
      const response = await axios.get(url, config);

      if (token !== response.data.token)
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ token: response.data.token })
        );
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function useUser() {
  const { data, error } = useSWR(`${API_URL}/home`, fetchUser);

  if (data) {
    if (data === "Invalid Token") {
      alert("Please login again");
    } else if (data === "Server Busy") {
      alert("Unauthorized access");
    }
  }

  useEffect(() => {
    if (error) {
      console.error("Error occurred:", error);
    }
  }, [error]);

  const isLoading = !data && !error;

  return {
    user: data,
    isError: error,
    isLoading,
    refetchUser: fetchUser,
  };
}
