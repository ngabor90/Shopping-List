import { useState, useEffect } from "react";
import Logo from "./Logo";
import Form from "./Form";
import ShoppingList from "./ShoppingList";
import Stats from "./Stats";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { useAuth } from "../context/useAuth";
import ResetPassword from "./ResetPassword";
import Toast from "./Toast";
import NotFound from "./NotFound";
import ConfirmDialog from "./ConfirmDialog";
import VerifyEmail from "./VerifyEmail";
import { useDarkMode } from "../context/useDarkMode";
import DarkToggle from "./DarkToggle";
import SkeletonLoader from "./SkeletonLoader";
import Footer from "./Footer";
import PrivacyPolicy from "./PrivacyPolicy";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const { token, logout, user, needsVerify, setNeedsVerify } = useAuth();
  const [items, setItems] = useState([]);
  const [authView, setAuthView] = useState("login"); // "login" | "register" | "forgot"
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, type }
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }
  const [dark, setDark] = useDarkMode();
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Auth headers helper
  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Backendről betöltés
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        showToast("Failed to load items.");
        setLoading(false);
      });
  }, [token]);

  // Új elem hozzáadása
  function handleAddItems(item) {
    fetch(API_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(item),
    })
      .then((res) => res.json())
      .then((savedItem) => setItems((items) => [...items, savedItem]))
      .catch(() => showToast("Failed to add item."));
  }

  // Elem módosítása
  function handleEditItem(id, updates) {
    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .then((updatedItem) =>
        setItems((items) =>
          items.map((item) => (item.id === id ? updatedItem : item)),
        ),
      )
      .catch(() => showToast("Failed to update item."));
  }

  // Elem törlése
  function handleDeleteItem(id) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
      .then(() => setItems((items) => items.filter((item) => item.id !== id)))
      .catch(() => showToast("Failed to delete item."));
  }

  // Packed toggle
  function handleToggleItem(id) {
    const itemToToggle = items.find((item) => item.id === id);
    if (!itemToToggle) return;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ packed: !itemToToggle.packed }),
    })
      .then((res) => res.json())
      .then((updatedItem) =>
        setItems((items) =>
          items.map((item) => (item.id === id ? updatedItem : item)),
        ),
      )
      .catch(() => showToast("Failed to toggle item."));
  }

  // Lista törlése
  function handleClearList() {
    setConfirm({
      message: "Are you sure you want to delete all items?",
      onConfirm: () => {
        setConfirm(null);
        Promise.all(
          items.map((item) =>
            fetch(`${API_URL}/${item.id}`, {
              method: "DELETE",
              headers: authHeaders(),
            }),
          ),
        )
          .then(() => {
            setItems([]);
            showToast("List cleared successfully.", "success");
          })
          .catch(() => showToast("Failed to clear list."));
      },
    });
  }

  // Toast megjelenítése
  function showToast(message, type = "error") {
    setToast({ message, type });
  }

  // Lista újrarendezése
  function handleReorder(reorderedItems) {
    setItems(reorderedItems);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/items/reorder`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ items: reorderedItems.map((i) => i.id) }),
    }).catch(() => showToast("Failed to save order."));
  }

  // Logout
  async function handleLogout() {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
        method: "POST",
        headers: authHeaders(),
      });
    } catch {
      // silent
    } finally {
      logout();
      setItems([]);
    }
  }

  if (token && needsVerify) {
    return (
      <VerifyEmail
        onVerified={() => {
          setNeedsVerify(false);
          localStorage.setItem("needs_verify", "0");
          window.history.replaceState({}, "", "/");
        }}
      />
    );
  }

  // Auth oldalak
  if (!token) {
    const isResetPage = window.location.pathname.startsWith("/reset-password/");
    const isKnownPage = [
      "",
      "/",
      "/login",
      "/register",
      "/forgot-password",
    ].includes(window.location.pathname);

    return (
      <>
        <DarkToggle dark={dark} onToggle={() => setDark(!dark)} />
        {!isKnownPage && !isResetPage && (
          <NotFound onGoHome={() => setAuthView("login")} />
        )}
        {isResetPage && (
          <ResetPassword
            onResetSuccess={() => setAuthView("login")}
            onSwitchToLogin={() => setAuthView("login")}
          />
        )}
        {authView === "register" && (
          <Register onSwitchToLogin={() => setAuthView("login")} />
        )}
        {authView === "forgot" && (
          <ForgotPassword onSwitchToLogin={() => setAuthView("login")} />
        )}
        {authView === "login" && (
          <Login
            onSwitchToRegister={() => setAuthView("register")}
            onForgotPassword={() => setAuthView("forgot")}
          />
        )}
      </>
    );
  }

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  if (loading) {
    return (
      <div className="app">
        <Logo
          onLogout={handleLogout}
          user={user}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
        />
        <SkeletonLoader />
        <Stats items={[]} />
      </div>
    );
  }

  const knownPaths = ["", "/"];
  if (
    !knownPaths.includes(window.location.pathname) &&
    !window.location.pathname.startsWith("/reset-password/")
  )
    return <NotFound onGoHome={() => window.location.replace("/")} />;

  return (
    <div className="app">
      <Logo
        onLogout={handleLogout}
        user={user}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
      />
      <Form onAddItems={handleAddItems} />
      <ShoppingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
        onEditItem={handleEditItem}
        onReorder={handleReorder}
      />
      <Stats items={items} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      <Footer onPrivacyPolicy={() => setShowPrivacy(true)} />
    </div>
  );
}
