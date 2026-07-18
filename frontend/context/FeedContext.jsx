import { createContext, useContext, useState } from "react";

const FeedContext = createContext(null);

export function FeedProvider({ children }) {
  const [posts, setPosts] = useState([]);

  return (
    <FeedContext.Provider value={{ posts, setPosts }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed debe usarse dentro de <FeedProvider>");
  return ctx;
}