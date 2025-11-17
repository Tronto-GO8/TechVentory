import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const { loginGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hasRun = useRef(false); // ← impede execuções duplicadas

  useEffect(() => {
    if (hasRun.current) return;    // ← bloqueia repetições
    hasRun.current = true;

    const run = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (!code) {
        console.error("Código ausente no callback.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/Techventory/auth/google/callback?code=${code}`
        );

        const data = await res.json();
        console.log("Callback data:", data);

        if (data.token && data.user) {
          await loginGoogle(data.token, data.user);
          navigate("/app/inicial", { replace: true });
        } else {
          console.error("Resposta inesperada:", data);
          navigate("/login");
        }
      } catch (err) {
        console.error("Erro no fetch:", err);
        navigate("/login");
      }
    };

    run();
  }, []);

  return <p>Conectando...</p>;
}
