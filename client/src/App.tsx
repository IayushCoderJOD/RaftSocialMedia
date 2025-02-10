import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import Footer from './components/Footer';
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import UserProfile from './pages/UserProfile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='flex'>
          <div className='w-[20%]'>
            <MenuBar />
          </div>
          <div>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route
                path='/login'
                element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <AuthRoute>
                    <Register />
                  </AuthRoute>
                }
              />
              <Route path='/posts/:postId' element={<SinglePost />} />
              <Route path='/posts/edit/:postId' element={<SinglePost edit />} />
              <Route path='/user/:userId' element={<UserProfile />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;