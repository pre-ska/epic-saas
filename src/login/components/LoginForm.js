import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function LoginForm({ setSubmitted }) {
  const supabase = useSupabaseClient();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    setLoading(true);
    e.preventDefault();
    const email = e.target.elements.email.value;

    // ! signInWithOtp je metoda is supabase-a za magic link
    // ! otp - one time password
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
      setSubmitted(email);
    }
  }

  return (
    <form onSubmit={onSubmit} className="content-grid home-hero">
      {error && (
        <div className="danger" role="alert">
          {error}
        </div>
      )}
      <h1>Welcome back!</h1>

      <div className="email-input">
        <label htmlFor="email">Email</label>

        <input type="email" name="email" id="email" autoComplete="email" />
      </div>

      <button disabled={loading} className="large-button">
        <div className="large-button-text">Login</div>
      </button>
    </form>
  );
}
