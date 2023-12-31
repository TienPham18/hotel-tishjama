import useLocalStorage from "use-local-storage";
import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function useUser() {
  const router = useRouter();
  const [userID, setUserID] = useLocalStorage("userID", "");

  const { data: user } = useSWR(
    userID ? `/api/users/${userID}` : null,
    fetcher
  );

  async function login({ email, roomNumber }) {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, roomNumber }),
    });

    if (!response.ok) {
      alert("Incorrect Credentials");
      return;
    }

    const loggedInUser = await response.json();
    setUserID(loggedInUser._id);
    email === "service-manager@hotel-tishjama.com"
      ? router.push("/SPD")
      : router.push("/");
  }

  function logout() {
    setUserID(null);
    router.push("/");
  }

  return { user, login, logout };
}
