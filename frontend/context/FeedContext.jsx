import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { feedApi } from "../services/feedApi";

const FeedContext = createContext(null);

function normalizeStoredToken(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "string" ? parsed : value;
  } catch {
    return value;
  }
}

const getSession = async () => {
  const [authToken, legacyToken, id, nombre] = await Promise.all([
    AsyncStorage.getItem("authToken"), AsyncStorage.getItem("auth_token"),
    AsyncStorage.getItem("userId"), AsyncStorage.getItem("nombre_usuario"),
  ]);
  return {
    token: normalizeStoredToken(authToken) || normalizeStoredToken(legacyToken),
    currentUser: { id: id ? Number(id) : null, nombre: nombre || "Estudiante UTP" },
  };
};

export function FeedProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: null, nombre: "Estudiante UTP" });

  const loadPosts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const session = await getSession();
      setCurrentUser(session.currentUser);
      const data = await feedApi.getPosts(session.token);
      setPosts(data.posts || []);
      return data.posts || [];
    } catch (loadError) {
      setError(loadError.message);
      throw loadError;
    } finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => { loadPosts().catch(() => {}); }, [loadPosts]);

  const withSession = useCallback(async (action) => {
    const session = await getSession();
    setCurrentUser(session.currentUser);
    if (!session.token) throw new Error("Inicia sesión para realizar esta acción.");
    return action(session);
  }, []);

  const createPost = useCallback(async (values) => withSession(async ({ token }) => {
    const data = await feedApi.createPost(token, values);
    setPosts((previous) => [data.post, ...previous]);
    return data.post;
  }), [withSession]);

  const updatePost = useCallback(async (id, values) => withSession(async ({ token }) => {
    const data = await feedApi.updatePost(token, id, values);
    setPosts((previous) => previous.map((post) => String(post.id) === String(id) ? data.post : post));
    return data.post;
  }), [withSession]);

  const deletePost = useCallback(async (id) => withSession(async ({ token }) => {
    await feedApi.deletePost(token, id);
    setPosts((previous) => previous.filter((post) => String(post.id) !== String(id)));
  }), [withSession]);

  const votePost = useCallback(async (id, type) => withSession(async ({ token }) => {
    const data = await feedApi.react(token, id, type);
    setPosts((previous) => previous.map((post) => String(post.id) === String(id)
      ? { ...post, likes: data.likes, userVote: data.userVote } : post));
    return data;
  }), [withSession]);

  const addComment = useCallback(async (id, texto) => {
    if (!texto?.trim()) return false;
    return withSession(async ({ token }) => {
      const data = await feedApi.addComment(token, id, texto.trim());
      setPosts((previous) => previous.map((post) => {
        if (String(post.id) !== String(id)) return post;
        const yaExiste = (post.comments || []).some(
          (comment) => String(comment.id) === String(data.comment.id),
        );
        if (yaExiste) return post;
        return { ...post, comments: [...(post.comments || []), data.comment] };
      }));
      return true;
    });
  }, [withSession]);

  const toggleSavedPost = useCallback(async (id) => withSession(async ({ token }) => {
    const data = await feedApi.toggleSaved(token, id);
    setPosts((previous) => previous.map((post) => String(post.id) === String(id)
      ? { ...post, saved: data.saved } : post));
    return data.saved;
  }), [withSession]);

  const reportPost = useCallback((id) => {
    setPosts((previous) => previous.map((post) => String(post.id) === String(id) ? { ...post, reported: true } : post));
  }, []);

  const savedPostIds = useMemo(() => posts.filter((post) => post.saved).map((post) => post.id), [posts]);
  const value = useMemo(() => ({
    posts, loading, error, currentUser, savedPostIds, loadPosts,
    refreshPosts: () => loadPosts({ silent: true }), createPost, updatePost, deletePost,
    votePost, toggleReaction: votePost, addComment, toggleSavedPost, reportPost,
  }), [posts, loading, error, currentUser, savedPostIds, loadPosts, createPost, updatePost, deletePost, votePost, addComment, toggleSavedPost, reportPost]);

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed debe usarse dentro de <FeedProvider>");
  return ctx;
}
