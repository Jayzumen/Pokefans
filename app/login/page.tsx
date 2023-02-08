// "use client";

// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { db } from "../firebase";

export default function Login() {
  //   const [username, setUserName] = useState("");

  //   const navigate = useRouter();

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     if (!username) {
  //       toast("Please enter a username");
  //       return;
  //     }
  //     const userRef = doc(db, "Users", username);
  //     await getDoc(userRef).then((docSnap) => {
  //       if (docSnap.exists()) {
  //         localStorage.setItem("pokefans-name", username);
  //         toast(`Welcome back ${username}`);
  //         navigate.push("/team");
  //       } else {
  //         setDoc(userRef, { username });
  //         localStorage.setItem("pokefans-name", username);
  //         toast(`Welcome ${username}`);
  //         navigate.push("/team");
  //       }
  //     });
  //   };
  return (
    <div className="container mx-auto flex flex-col pb-8 text-center">
      {/* <h1 className="my-6 text-5xl font-semibold underline">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex min-w-[300px] max-w-[600px] flex-col gap-4"
      >
        <label htmlFor="username">Username</label>
        <input
          className="rounded-lg p-2 text-black outline-none"
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter username..."
        />
        <button
          className="rounded-lg bg-sky-700 p-2 text-lg font-semibold transition hover:bg-sky-800"
          type="submit"
        >
          Login
        </button>
      </form> */}
    </div>
  );
}
