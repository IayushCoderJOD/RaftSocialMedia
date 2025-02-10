import React from 'react';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import LikeButton from './LikeButton';

interface User {
  isAdmin?: boolean;
  username: string;
}

interface Post {
  id: string;
  likes: any[];
  likeCount: number;
  commentCount: number;
  body: string;
}

interface CardsButtonsProps {
  user: { user?: User; username: string };
  buttonSize: any;
  post: Post;
}

const CardsButtons: React.FC<CardsButtonsProps> = ({ user: { user, username }, buttonSize, post: { id, likes, likeCount, commentCount, body } }) => {
  return (
    <>
      <LikeButton buttonSize={buttonSize} user={user} post={{ id, likes, likeCount }} />
      {/* <CommentButton buttonSize={buttonSize} post={{ id, commentCount }} /> */}
      {(user?.isAdmin || user?.username === username) && (
        <>
          <DeleteButton buttonSize={buttonSize} postId={id} />
          <EditButton buttonSize={buttonSize} postId={id} postBody={body} />
        </>
      )}
    </>
  );
};

export default CardsButtons;
