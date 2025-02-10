import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { useForm } from '../util/hooks';

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, { body: '', imageUrl: '' });
  const [selectedImage, setSelectedImage] = useState('');

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: { body: `${values.body} ${values.imageUrl}`.trim() },
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] }
      });
      values.body = '';
      values.imageUrl = '';
      setSelectedImage('');
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h5 className="page-title">Post something!</h5>
        <Form.Field>
          <Form.Input
            placeholder="Write caption..."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Form.Input
            placeholder="Image URL..."
            name="imageUrl"
            onChange={onChange}
            value={values.imageUrl}
          />
          {values.imageUrl && <img src={values.imageUrl} alt="Preview" className="image-preview" />}
          <Button type="submit" color="teal">Post</Button>
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

// CSS for Image Preview
const styles = `
  .image-preview {
    max-width: 100%;
    max-height: 200px;
    margin-top: 10px;
    border-radius: 5px;
  }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
