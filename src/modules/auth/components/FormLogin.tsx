import { useState } from "react";
import type { LoginFormInputs, LoginFromProps } from "../types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/LoginSchema";
import { useForm } from "react-hook-form";
import { HiEyeSlash } from "react-icons/hi2";
import { HiEye } from "react-icons/hi2";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import useRequest from "@/core/hooks/useRequest";
export default function FormLogin({ showNotification }: LoginFromProps) {
  const { saveLoginData } = useAuth();
  const { loadReq, loading, error } = useRequest();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };

      const response = await loadReq("login", false, "POST", loginData);
      console.log("Respuesta del login:", response);
      saveLoginData(response);

      console.log("Usuario logueado:", response);
      reset();
      showNotification("Login exitoso", "success", 3500);
    } catch (err: unknown) {
      console.error("Error en login:", err);
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Error en login";
      showNotification(error || message, "error");
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100dvh"
      >
        <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
          <Typography variant="h5" mb={2} align="center">
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("password", {
                required: "Contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="mostrar u ocultar contraseña"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <HiEyeSlash /> : <HiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box mt={2} display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading && isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Entrar"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </>
  );
}
