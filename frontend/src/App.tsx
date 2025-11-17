import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Cadastrar from "./pages/Cadastro";
import EsqueceuSenha from "./pages/EsqueceuSenha";
import Login from "./pages/Login";
import RedefinirSenha from "./pages/RedefinirSenha";
import AuthCallback from "./pages/AuthCallback";
import Layout from "./Layout";
import { CarrinhoProvider } from "./contexts/ProdutoCarrinhoContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/esqueceuSenha" element={<EsqueceuSenha />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
            <Route path="/cadastro" element={<Cadastrar />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            {/* <Route path="*" element={<RedefinirSenha />} /> */}
            <Route
              path="/app/*"
              element={
                <CarrinhoProvider>
                  <Layout />
                </CarrinhoProvider>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
