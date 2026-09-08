import { useState } from "react";
import { createUser } from "../services/UserServices";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

export default function Register() {
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
      await createUser(user as User);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={user.user_name}
            onChange={(e) => setUser({ ...user, user_name: e.target.value })}
          />
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
          <input
            type="text"
            placeholder="Role"
            value={user.user_role}
            onChange={(e) => setUser({ ...user, user_role: e.target.value })}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </section>
  );
}
