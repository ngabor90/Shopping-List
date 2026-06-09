import { useState, useEffect, useCallback } from "react";
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
import CookieBanner from "./CookieBanner";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const { token, logout, user, needsVerify, setNeedsVerify } = useAuth();
  const [items, setItems] = useState([]);
  const [authView, setAuthView] = useState("login");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [dark, setDark] = useDarkMode();
  const [showPrivacy, setShowPrivacy] = useState(false);

  const path = window.location.pathname;
  const isResetPage = path.startsWith("/reset-password/");
  const isKnownPage = ["", "/", "/login", "/register", "/forgot-password"].includes(path);

  const authHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(API_URL, {
      headers: authHeaders(),
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
  }, [token, authHeaders, showToast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    if (verified === "1") {
      showToast("Email verified successfully!", "success");
      window.history.replaceState({}, "", "/");
    } else if (verified === "error") {
      showToast("Email verification failed. Please try again.", "error");
      window.history.replaceState({}, "", "/");
    }
  }, [showToast]);

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

  function handleDeleteItem(id) {
    setConfirm({
      message: "Are you sure you want to delete this item?",
      onConfirm: () => {
        setConfirm(null);
        fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: authHeaders(),
        })
          .then(() =>
            setItems((items) => items.filter((item) => item.id !== id)),
          )
          .catch(() => showToast("Failed to delete item."));
      },
    });
  }

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

  function handleClearList() {
    setConfirm({
      message: "Are you sure you want to delete all items?",
      onConfirm: () => {
        setConfirm(null);
        fetch(API_URL, {
          method: "DELETE",
          headers: authHeaders(),
        })
          .then(() => {
            setItems([]);
            showToast("List cleared successfully.", "success");
          })
          .catch(() => showToast("Failed to clear list."));
      },
    });
  }

  function handleReorder(reorderedItems) {
    setItems(reorderedItems);

    fetch(`${API_BASE_URL}/items/reorder`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ items: reorderedItems.map((i) => i.id) }),
    }).catch(() => showToast("Failed to save order."));
  }

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
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

  if (!token) {
    if (showPrivacy) {
      return (
        <PrivacyPolicy
          onBack={() => setShowPrivacy(false)}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
        />
      );
    }

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
            onPrivacyPolicy={() => setShowPrivacy(true)}
          />
        )}
        <CookieBanner onPrivacyPolicy={() => setShowPrivacy(true)} />
      </>
    );
  }

  if (showPrivacy) {
    return (
      <PrivacyPolicy
        onBack={() => setShowPrivacy(false)}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
      />
    );
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

  if (!isKnownPage && !isResetPage)
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
      <Footer
        onPrivacyPolicy={() => setShowPrivacy(true)}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
      />
      <CookieBanner onPrivacyPolicy={() => setShowPrivacy(true)} />
    </div>
  );
}