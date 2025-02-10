import jwtDecode from "jwt-decode";
import React, { createContext, ReactNode, useReducer } from "react";

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

interface User {
  token: string;
}

interface AuthState {
  user: JwtPayload | null;
}

interface AuthContextType {
  user: JwtPayload | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Initial state
const initialState: AuthState = { user: null };

const token = localStorage.getItem("jwtToken");

if (token) {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwtToken");
    } else {
      initialState.user = decodedToken;
    }
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("jwtToken");
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
});

type AuthAction = { type: "LOGIN"; payload: JwtPayload } | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData: User) => {
    localStorage.setItem("jwtToken", userData.token);
    const decodedToken = jwtDecode<JwtPayload>(userData.token);
    dispatch({ type: "LOGIN", payload: decodedToken });
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

