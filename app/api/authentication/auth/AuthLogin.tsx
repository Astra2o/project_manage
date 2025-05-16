"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Stack, Typography, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";

interface AuthLoginProps {
  subtext?: React.ReactNode;
  subtitle?: React.ReactNode;
}

interface LoginFormData {
  email: string;
  password: string;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ subtext, subtitle }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const dispatch: AppDispatch = useDispatch();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        router.replace("/");
      }
    }
  }, [router]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      
      if (loginUser.fulfilled.match(resultAction)) {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {subtext}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          disabled={isLoading}
          error={!!error}
          required
          autoComplete="email"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          disabled={isLoading}
          error={!!error}
          required
          autoComplete="current-password"
        />
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          size="large"
          sx={{ position: 'relative' }}
        >
          {isLoading ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
              <span style={{ visibility: 'hidden' }}>Login</span>
            </>
          ) : (
            "Login"
          )}
        </Button>

        {subtitle}
      </Stack>
    </form>
  );
};

export default AuthLogin;
