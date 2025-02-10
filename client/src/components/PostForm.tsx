import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { useForm } from '../util/hooks';

const DUMMY_USERS = ['Ayush1208', 'Ishita Goswami', 'sanskritich', 'IncognitoUser', 'Eve'];

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, { body: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] }
      });
      values.body = '';
      setShowSuggestions(false);
    },
  });

  function createPostCallback() {
    createPost();
  }

  const handleInputChange = (e) => {
    const text = e.target.value;
    values.body = text;
    onChange(e);

    // Detect mentions and show suggestions
    const match = text.match(/@(\w*)$/);
    if (match) {
      const filteredUsers = DUMMY_USERS.filter((user) => user.toLowerCase().startsWith(match[1].toLowerCase()));
      setSuggestions(filteredUsers);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectUser = (username) => {
    values.body = values.body.replace(/@(\w*)$/, `@${username} `);
    setShowSuggestions(false);
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h5 className="page-title">Post something!</h5>
        <Form.Field >
          <Form.Input
            placeholder="Write caption along with image URL ..."
            name="body"
            onChange={handleInputChange}
            value={values.body}
            error={error ? true : false}
          />
          {showSuggestions && (
            <ul className="suggestions-list">
              {suggestions.map((user) => (
                <li key={user} onClick={() => selectUser(user)}>
                  @{user}
                </li>
              ))}
            </ul>
          )}
          <Button type="submit" color="teal">
            Post
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: '20px' }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

// CSS for Suggestions
const styles = `
  .suggestions-list {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    list-style: none;
    padding: 5px;
    width: 250px;
    max-height: 150px;
    overflow-y: auto;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
  .suggestions-list li {
    padding: 8px;
    cursor: pointer;
  }
  .suggestions-list li:hover {
    background: #f0f0f0;
  }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
