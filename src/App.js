import { useState } from "react";
import { useSelector } from "react-redux";

import Routes from "./Routes";

import TopBar from "./components/TopBar";
import UserInfo from "./components/UserInfo";

const App = () => {
  const [userInfoIsShown, setUserInfoIsShown] = useState(false);

  const codeforcesHandle = useSelector((state) => state.user.codeforcesHandle);
  const uvaHandle = useSelector((state) => state.user.uvaHandle);
  const atcoderHandle = useSelector((state) => state.user.atcoderHandle);
  const spojHandle = useSelector((state) => state.user.spojHandle);
  const codechefHandle = useSelector((state) => state.user.codechefHandle);

  const showUserInfoHandler = () => {
    setUserInfoIsShown(true);
  };

  const hideUserInfoHandler = () => {
    setUserInfoIsShown(false);
  };

  const usersIsNotSetted = () => {
    return (
      !codeforcesHandle &&
      !uvaHandle &&
      !atcoderHandle &&
      !spojHandle &&
      !codechefHandle
    );
  };

  return (
    <>
      {(userInfoIsShown || usersIsNotSetted()) && (
        <UserInfo onClose={hideUserInfoHandler} />
      )}
      <TopBar onShowUserInfo={showUserInfoHandler} />
      <main className="main">
        <Routes />
      </main>
    </>
  );
};

export default App;
