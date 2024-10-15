import React, { createContext, useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Register from "./components/register/Register";
import Welcome from "./components/Welcome/Welcome";
import Login from "./components/login/Login";
import PlayerS from "./components/PlayerS/PlayerS";
import Recruiter from "./components/Recruiter/Recruiter";
import AgentS from "./components/AgentS/AgentS";
import Search from "./components/Search/Search";
import ClubS from "./components/ClubS/ClubS";
import Profile from "./components/Profiles/Profile";
import Sprofiles from "./components/Sprofiles/Sprofiles";
import Welcomepick from "./components/login/Welcomepick";
import Footer from "./components/Footer";
import Searching from "./components/Search/Search";
import './i18n';
import CategoryListPage from "./components/Welcome/CategoryListPage";
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [id, setId] = useState("loading");
  const [username, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setId(storedId || null);
    setIsAuthenticated(!!storedId);
  }, []);

  const updateId = (newId) => {
    setId(newId);
    setIsAuthenticated(!!newId);
    if (newId) {
      localStorage.setItem("id", newId);
    } else {
      localStorage.removeItem("id");
    }
  };

  return (
    <AppContext.Provider
      value={{ username, setUserName, id, setId: updateId, isAuthenticated }}
    >
      {id !== "loading" && children}
    </AppContext.Provider>
  );
};

const Layout = ({ children }) => (
  <div>
    <Searching />
    {children}
    <Footer />
  </div>
);

// Updated AuthRoute component to handle both authenticated and unauthenticated cases
const AuthRoute = ({
  element: Element,
  authRedirect = "/welcome",
  unauthRedirect = "/login",
  ...rest
}) => {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();

  if (isAuthenticated) {
    return authRedirect ? (
      <Navigate to={authRedirect} replace />
    ) : (
      <Element {...rest} />
    );
  } else {
    return unauthRedirect ? (
      <Navigate to={unauthRedirect} state={{ from: location }} replace />
    ) : (
      <Element {...rest} />
    );
  }
};

const App = () => {
  const { id, isAuthenticated } = useAppContext();

  if (id === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/playerlog" element={<PlayerS />} />
          <Route path="/agentlog" element={<AgentS />} />
          <Route path="/clublog" element={<ClubS />} />
          <Route path="/list" element={<CategoryListPage/>}/>
          <Route path="/recruiterlog" element={<Recruiter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pprofile" element={<Sprofiles />} />
          <Route path="/welcomepick" element={<Welcomepick />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const AppWrapper = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWrapper;
