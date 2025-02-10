import { gql, useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login() {
  const context = useContext(AuthContext);
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      navigate('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0]?.extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h1>

        <form onSubmit={onSubmit} noValidate className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={values.username}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {Object.keys(errors).length > 0 && (
          <div className="bg-red-100 text-red-700 p-4 mt-4 rounded-lg">
            <ul className="list-disc pl-4">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!   
    $password: String!
  ) {
    login(     
        username: $username
        password: $password
    ) {
      id
      email
      username
      createdAt
      photoURL
      isAdmin
      token      
    }
  }
`;

export default Login;
