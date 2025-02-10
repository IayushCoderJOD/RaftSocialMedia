import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { ThemeContext } from "../context/theme";
import CardsButtons from "./CardsButtons";

const PostCard = ({
  post: { body, createdAt, id, username, user: postUser, likeCount, commentCount, likes },
}) => {
  const { user } = useContext(AuthContext);
  const { isDarkTheme, buttonSize } = useContext(ThemeContext);

  // Function to detect and replace image URLs in body text
  const renderBodyWithImages = (text) => {
    const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/gi;
    const parts = text.split(imageRegex);

    return parts.map((part, index) =>
      imageRegex.test(part) ? (
        <img
          key={index}
          src={part}
          alt="post"
          className="mt-2 rounded-lg w-full h-48 object-cover shadow-md"
        />
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div
      className={`w-[520px] p-5 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-2 ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
    >
      {/* User Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={"https://cdn-icons-png.flaticon.com/512/10337/10337609.png"}
          alt="profile"
          className="w-14 h-14 rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="font-semibold text-xl">{username}</h2>
          <span className="text-gray-400 text-sm">{moment(createdAt).fromNow()}</span>
        </div>
      </div>

      {/* Post Content */}
      <div className="font-medium mb-4 leading-relaxed text-lg">
        {renderBodyWithImages(body)}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-between">
        <CardsButtons
          user={{ user, username }}
          buttonSize={buttonSize}
          post={{ id, likes, likeCount, commentCount, body }}
        />
      </div>
    </div>
  );
};

export default PostCard;
