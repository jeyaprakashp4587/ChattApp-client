/** @format */

import { createContext, useContext, useState } from "react";

const Provider = createContext();
// ----
export const ProviderData = ({ children }) => {
  // --------------- //

  const [Chatuser, setChatuser] = useState([]);
  const [user, setUser] = useState();
  const [friendsLists, setFriendslist] = useState([]);
  const [receivemessagefromConetext, setReceivemsgfromContext] = useState();
  const [chatuserTrigger, setChatuserTrigger] = useState(false);
  const [convoContext, setConvoContext] = useState();
  return (
    <Provider.Provider
      value={{
        Chatuser,
        setChatuser,
        user,
        setUser,
        friendsLists,
        setFriendslist,
        receivemessagefromConetext,
        setReceivemsgfromContext,
        chatuserTrigger,
        setChatuserTrigger,
        convoContext,
        setConvoContext,
      }}
    >
      {children}
    </Provider.Provider>
  );
};
export const useData = () => {
  return useContext(Provider);
};
