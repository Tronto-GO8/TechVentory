import {
  InputEmail,
  InputSenha,
} from "@/components/loginCadastro/InputsLoginCadastro";
import LoginSocial from "@/components/loginCadastro/LoginSocial";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OuSeparador from "@/components/ui/OuSeparador";
import TextoLinkAlternativo from "@/components/ui/TextoLinkAlternativo";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm } from "@/schemas/loginSchema";
import InputError from "@/components/InputError";
import FormCardHeader from "@/components/loginCadastro/FormCardHeader";
import Header from "@/components/loginCadastro/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmitStatus } from "@/hooks/useSubmitStatus";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    status,
    serverError,
    startLoading,
    handleSuccess,
    handleError,
    getButtonContent,
    getButtonStyles,
  } = useSubmitStatus({
    onSuccess: () => navigate("/app/inicial"),
  });

  const enviar = async (data: LoginForm) => {
    startLoading();

    try {
      const res = await login(data.email, data.senha);

      if (!res.ok) {
        handleError(res.message ?? "Erro ao autenticar");
        return;
      }

      handleSuccess();
    } catch (error) {
      handleError("Erro ao autenticar");
    }
  };

  return (
    <div className="dark:bg-gray-900">
      <Header />
      <div className="flex items-center dark:bg-gray-900 justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="shadow-black dark:shadow-white border dark:border-white dark:bg-gray-900">
          <FormCardHeader titulo="Entrar" textoCentralizado />
          <CardContent className="space-y-4">
            <form className="space-y-4 " onSubmit={handleSubmit(enviar)}>
              <InputEmail {...register("email")} />
              <InputError message={errors.email?.message} />
              <InputSenha label="Senha" {...register("senha")} />
              <InputError message={errors.senha?.message} />

              {serverError && (
                <p className="text-sm text-red-400">{serverError}</p>
              )}

              <div className="text-right pt-4">
                <Link
                  to="/esqueceusenha"
                  className="text-sm hover:text-gray-600"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                className={getButtonStyles()}
                disabled={status !== "idle"}
              >
                {getButtonContent() || "Entrar"}
              </Button>
            </form>

            <OuSeparador strVisivel={true} />
            <LoginSocial />
            <TextoLinkAlternativo
              texto="Não tem um conta?"
              textoLink="Cadastrar"
              to="/cadastro"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
