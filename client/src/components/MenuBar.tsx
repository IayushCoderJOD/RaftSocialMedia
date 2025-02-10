import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import { ThemeContext } from '../context/theme';

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (_, { name }) => setActiveItem(name);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarStyle = {
    height: '100vh',
    width: '280px',
    backgroundColor: isDarkTheme ? '#1b1c1d' : '#00b5ad',
    color: isDarkTheme ? '#ffffff' : '#000000',
    paddingTop: '20px',
    position: 'fixed',
    left: '0',
    top: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  return (
    <Menu vertical style={sidebarStyle}>
      {/* Top Section: Navigation Links */}
      <div>
        <Menu.Item as={Link} to="/" name="home" active={activeItem === 'home'} onClick={handleItemClick}>
          <Icon name="home" /> Home
        </Menu.Item>
        {user?.isAdmin && (
          <Menu.Item as={Link} to="/admin" name="admin" active={activeItem === 'admin'} onClick={handleItemClick}>
            <Icon name="user secret" /> Admin
          </Menu.Item>
        )}
        {user && (
          <Menu.Item as={Link} to={`/user/${user.id}`} name="profile" active={activeItem === 'profile'} onClick={handleItemClick}>
            <Icon name="user" /> {user.username}'s Profile
          </Menu.Item>
        )}
      </div>

      {/* Bottom Section: Theme Toggle & Logout */}
      <div className="mt-auto">
        <Menu.Item as="a" onClick={toggleTheme}>
          <Icon name={isDarkTheme ? 'sun' : 'moon'} /> Toggle Theme
        </Menu.Item>
        {user ? (
          <Menu.Item as="a" onClick={handleLogout}>
            <Icon name="sign-out" /> Logout
          </Menu.Item>
        ) : (
          <>
            <Menu.Item as={Link} to="/login" name="login" active={activeItem === 'login'} onClick={handleItemClick}>
              <Icon name="sign-in" /> Login
            </Menu.Item>
            <Menu.Item as={Link} to="/register" name="register" active={activeItem === 'register'} onClick={handleItemClick}>
              <Icon name="user plus" /> Register
            </Menu.Item>
          </>
        )}
      </div>
    </Menu>
  );
}

export default MenuBar;
