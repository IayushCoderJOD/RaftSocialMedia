import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserDetails from '../components/UserDetails';
import { AuthContext } from '../context/auth';

import { GET_USER_QUERY } from '../util/graphql';

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);

  if (user != null && user.id === userId) {
    return (
      <UserDetails user={user} auth={user} />
    )
  }

  const { data: { getUser: newUser } = {} } = useQuery(GET_USER_QUERY, {
    variables: {
      userId
    }
  });

  if (newUser) {
    return (
      <UserDetails user={newUser} />
    )
  }
};

export default UserProfile;
