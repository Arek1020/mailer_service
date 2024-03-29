import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tools from "../utils/Tools";
import { useNavigate, useLocation } from "react-router-dom";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import config from "../config";
import request from "../request";

interface SignInProps {}

const LoginScreen = (props: SignInProps) => {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();

  const [alert, setAlert] = useState<boolean>(false);
  const [alertContent, setAlertContent] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated()) {
      navigate({ pathname: "/" }, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    var payload = {
      email: data.get("email"),
      password: data.get("password"),
    };

    let response = await request.post(
      `${config.SERVER_URL}/user/login`,
      payload
    );

    if (!response?.token && response.message) {
      setAlertContent(response.message);
      setAlert(true);
      return;
    }

    if (
      signIn({
        token: response.token,
        expiresIn: 3600,
        tokenType: "Mailer",
        authState: JSON.parse(response.user),
      })
    ) {
      setAlert(false);
      localStorage.setItem("user", response.user);
      navigate(from, { replace: true });
    } else {
      setAlertContent("Błąd logowania");
      setAlert(true);
    }
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: "white",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Zaloguj się
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email / Login"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {alert ? <Alert severity="error">{alertContent}</Alert> : <></>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  Tools.showToast("Login clicked");
                }}
              >
                Zaloguj się
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Nie masz konta? Zarejestruj się"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginScreen;
