import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Grid, Image } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { ThemeContext } from '../context/theme';

import CardsButtons from '../components/CardsButtons';
import DeleteButton from '../components/DeleteButton';

const SinglePost = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const { buttonSize } = useContext(ThemeContext);
  const navigate = useNavigate();

  const commentInputRef = useRef(null);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');  // New state for image URL

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      setImageUrl('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
      imageUrl, // Sending image URL to the backend
    },
  });

  function deletePostCallback() {
    navigate('/');
  }

  let postMarkup;

  if (!getPost) {
    postMarkup = <h1 className="page-title">Loading post...</h1>;
  } else {
    const {
      id,
      body,
      user: { photoURL },
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
      imageUrl: postImageUrl, // Get post image URL
    } = getPost;

    postMarkup = (
      <Grid columns={2} doubling stackable>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  <Image avatar circular src={photoURL} />
                  {username}
                </Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                  {body}
                  {postImageUrl && (
                    <Image src={postImageUrl} alt="Post Image" style={{ marginTop: '10px' }} />
                  )}
                </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <CardsButtons
                  user={{ user, username }}
                  buttonSize={buttonSize}
                  post={{ id, likes, likeCount, commentCount, body }}
                />
              </Card.Content>
            </Card>

            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        ref={commentInputRef}
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />
                    </div>
                    <div className="ui action input fluid" style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        placeholder="Image URL (optional)"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="ui teal button"
                      disabled={comment.trim() === ''}
                      onClick={submitComment}
                      style={{ marginTop: '10px' }}
                    >
                      Submit
                    </button>
                  </Form>
                </Card.Content>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>
                    {comment.body}
                    {comment.imageUrl && (
                      <Image src={comment.imageUrl} style={{ marginTop: '10px' }} />
                    )}
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

// GraphQL Query to Fetch Post
export const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      user {
        photoURL
      }
      createdAt
      username
      imageUrl 
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
        imageUrl  # Fetching image URL for comments
      }
    }
  }
`;

// GraphQL Mutation for Comment Submission
const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!, $imageUrl: String) {
    createComment(postId: $postId, body: $body, imageUrl: $imageUrl) {
      id
      comments {
        id
        body
        createdAt
        username
        imageUrl  # Storing image URL in comments
      }
      commentCount
    }
  }
`;

export default SinglePost;
