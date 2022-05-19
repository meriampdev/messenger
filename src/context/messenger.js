import { useState, createContext } from "react"

export const MessengerContext = createContext(null);

export const MessengerProvider = ({ children }) => {
  const [currentConvo, setConvoId] = useState("");
  const [user, setUser] = useState(null)

  const setCurrentConvo = (value) => {
    if (value) {
      setConvoId(value);
    } else {
      setConvoId("");
    }
  };

  const setCurrentUser = (value) => {
    if (value) {
      setUser(value);
    } else {
      setUser(null);
    }
  };

  return (
    <>
      <MessengerContext.Provider value={{ data: { currentConvo, user }, setCurrentConvo, setCurrentUser }}>
        {children}
      </MessengerContext.Provider>
    </>
  );
};
