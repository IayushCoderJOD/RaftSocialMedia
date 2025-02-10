import { useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";

import Intro from "../components/Intro";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { ThemeContext } from "../context/theme";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const { isDarkTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const posts = data?.getPosts || [];
  const [filterByFollowed, setFilterByFollowed] = useState(true);
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const storedUsers = JSON.parse(localStorage.getItem(`followedUsers_${user.username}`)) || [];
      setFollowedUsers([...new Set([user.username, ...storedUsers])]); // Ensure the user is always included
    } else {
      setFollowedUsers([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`followedUsers_${user.username}`, JSON.stringify(followedUsers));
    }
  }, [followedUsers, user]);

  const toggleFollowUser = (userId) => {
    if (!user || userId === user.username) return;
    setFollowedUsers((prev) => {
      const updatedFollowed = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];

      localStorage.setItem(`followedUsers_${user.username}`, JSON.stringify(updatedFollowed));
      return updatedFollowed;
    });
  };

  const followedPosts = posts.filter((post) => followedUsers.includes(post.username));

  return (
    <div className="flex flex-col items-center min-h-screen bg-inherit w-[800px]">
      <div className="w-full max-w-6xl p-5 text-black">
        <Intro />
      </div>

      {user && <div className="w-full max-w-3xl mb-6"><PostForm /></div>}

      <div className="flex justify-between items-center w-full max-w-6xl mb-4 px-36">
        <h1 className="text-2xl font-semibold">
          {filterByFollowed ? "Followed Posts" : "All Posts"}
        </h1>
        {user && (
          <button
            onClick={() => setFilterByFollowed((prev) => !prev)}
            className="px-4 py-2 bg-[#00b5ad] text-white rounded-lg hover:scale-105 transition-transform"
          >
            {filterByFollowed ? "Show All Posts" : "Show Followed Posts"}
          </button>
        )}
      </div>

      {user && followedUsers.length > 0 && (
        <div className={`fixed right-0  p-4 w-64 h-screen overflow-y-auto rounded-lg shadow-md transition-all ${isDarkTheme ? "bg-black text-white" : "bg-white"}`}>
          <h2 className="text-lg font-semibold mb-3">Followed Users</h2>
          <ul className="gap-2">
            {followedUsers.map((username) => (
              <li
                key={username}
                className={`mt-5 px-3 py-1 rounded-lg text-sm text-center ${isDarkTheme ? "bg-gray-700 text-white" : "bg-[#00b5ad] text-white"}`}
              >
                {username}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full max-w-2xl px-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.h1 key="loading" className="text-xl font-medium">
              Loading posts...
            </motion.h1>
          ) : (
            <motion.div
              key={filterByFollowed ? "followed" : "all"}
              className="flex flex-col gap-6"
            >
              {(filterByFollowed ? followedPosts : posts).length === 0 ? (
                <h1 className="text-xl font-medium text-center">No posts available.</h1>
              ) : (
                (filterByFollowed ? [...followedPosts].reverse() : [...posts].reverse()).map(
                  (post) => (
                    <div key={post.id} className="relative bg-white p-4 rounded-lg shadow-lg">
                      <PostCard post={post} />
                      {user && post.username !== user.username && (
                        <button
                          onClick={() => toggleFollowUser(post.username)}
                          className={`absolute top-3 right-9 px-3 py-1 text-sm rounded-lg transition-all ${followedUsers.includes(post.username) ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                        >
                          {followedUsers.includes(post.username) ? "Unfollow" : "Follow"}
                        </button>
                      )}
                    </div>
                  )
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Home;
