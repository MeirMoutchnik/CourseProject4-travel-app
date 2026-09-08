import { useState } from "react";
import { login as loginUser } from "../services/UserServices";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    user_id: 0,
    user_name: "",
    user_email: "",
    user_password: "",
    user_role: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await loginUser(user.user_email, user.user_password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("role", response.user.user_role);
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={user.user_email}
            onChange={(e) => setUser({ ...user, user_email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={user.user_password}
            onChange={(e) =>
              setUser({ ...user, user_password: e.target.value })
            }
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}
