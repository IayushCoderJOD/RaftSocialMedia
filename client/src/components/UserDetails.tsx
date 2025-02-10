import { useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Form, Icon, Image, Label } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { storage } from "../util/firestore";
import { FETCH_POSTS_QUERY, UPDATE_USER_MUTATION } from "../util/graphql";
import { useForm } from "../util/hooks";

const UserDetails = ({ user, auth = false }) => {
  const [newPhoto, setNewPhoto] = useState(user?.photoURL || "");
  const [file, setFile] = useState(null);
  const { login } = useContext(AuthContext);
  const { values, onChange, onSubmit } = useForm(updateProfileCallback, { photoURL: newPhoto });

  const [updateUserMutation, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    variables: {
      userId: user?.id,
      photoURL: newPhoto,
    },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    update(store, { data: { updateUser } }) {
      localStorage.setItem("jwtToken", updateUser.token);
      login(updateUser);
      setFile(null);
    },
  });

  useEffect(() => {
    if (newPhoto && newPhoto !== user?.photoURL) {
      updateUserMutation();
    }
  }, [newPhoto]);

  function updateProfileCallback() {
    if (file) uploadImage();
  }

  const uploadImage = async () => {
    if (!file) return;
    const imageRef = ref(storage, `images/${file.name}`);

    try {
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setNewPhoto(url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <Container textAlign="center" style={{ marginTop: "2rem" }}>
      <h1>User Profile</h1>
      <Card centered raised style={{ padding: "1rem", width: "350px" }}>
        <Image
          src={"https://static-00.iconduck.com/assets.00/user-icon-512x512-x23sj495.png"}
          size="small"
          circular
          centered
          bordered
          style={{ margin: "1rem auto" }}
        />

        {auth && (
          <Form loading={loading} onSubmit={onSubmit} style={{ marginBottom: "1rem" }}>
            <Form.Field>

              <input
                accept="image/*"
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />

            </Form.Field>

            {file?.name && (
              <Label className="form-selected-file" color="blue">
                <Icon name="file" />
                {file.name}
                <Button
                  basic
                  size="small"
                  inverted
                  icon="delete"
                  onClick={() => setFile(null)}
                  style={{ marginLeft: "10px" }}
                />
              </Label>
            )}
          </Form>
        )}

        <Card.Content>
          <Card.Header>{user?.username || "Anonymous User"}</Card.Header>
          <Card.Meta>Joined {moment(user?.createdAt).fromNow()}</Card.Meta>
        </Card.Content>

        <Card.Content extra>
          <Icon name="mail" /> {user?.email || "No email available"}
        </Card.Content>
      </Card>
    </Container>
  );
};

export default UserDetails;
