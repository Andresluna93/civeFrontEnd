import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, User, Lock, Eye, EyeOff } from "lucide-react";
import { userApi } from "../../services/services.js";

const Login = () => {
  const [form, setForm] = useState({ nameUser: "", password: "" });
  const [verContrasena, setVerContrasena] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      /*const response = await userApi.login(form);
      console.log(response);
      localStorage.setItem(
        "usuario",
        JSON.stringify({ name: response.data.name, role: response.data.role }),
      );*/
      await userApi.login(form);
      navigate("/admin");
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-accent-light flex flex-col">
      <header className="bg-solid-head text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HeartPulse className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-display font-bold">
                Clínica Internacional De La Visión De Ecuador
              </h1>
              <p className="text-white/80 text-sm">Panel de administración</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="card space-y-5">
            <div className="text-center mb-2">
              <div className="w-16 h-16 rounded-full bg-[oklch(62.3%_0.214_259.815)] flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-800">
                Iniciar sesión
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Acceso exclusivo para administradores
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <User className="w-4 h-4 mr-2 inline" />
                  Usuario
                </label>
                <input
                  type="text"
                  value={form.nameUser}
                  onChange={(e) =>
                    setForm({ ...form, nameUser: e.target.value })
                  }
                  className="input"
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="label">
                  <Lock className="w-4 h-4 mr-2 inline" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={verContrasena ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="input pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setVerContrasena((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {verContrasena ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="bg-[oklch(62.3%_0.214_259.815)] hover:brightness-90 text-white font-medium px-4 py-2.5 rounded-xl w-full transition-all flex justify-center"
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
