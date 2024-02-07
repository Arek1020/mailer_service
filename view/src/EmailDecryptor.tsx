import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import config from "./config";
import { useAuthHeader } from "react-auth-kit";
import request from "./request";
import { useParams } from "react-router";

const EmailDecryptor: React.FC = () => {
  const authHeader = useAuthHeader();
  const params = useParams();
  const [message, setMessage] = useState<string>("");

  // Definicja schematu walidacji za pomocą Yup
  const validationSchema = Yup.object({});

  // Inicjalizacja formik
  const formik = useFormik({
    initialValues: {
      messageId: params.messageId,
      message: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Logika obsługi wysyłki maila
      let result = await request.post(
        `${config.SERVER_URL}/mail/decrypt`,
        { ...values, messageId: params.messageId },
        authHeader()
      );
      setMessage(result);
    },
  });

  if (message)
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" align="center" gutterBottom>
          {message}
        </Typography>
      </Container>
    );

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Rozszyfruj wiadomości
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Hasło"
              variant="outlined"
              fullWidth
              required
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Rozszyfruj
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EmailDecryptor;
