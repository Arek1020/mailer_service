import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import config from "./config";
import { useAuthHeader } from "react-auth-kit";
import request from "./request";

const KeyGenerator: React.FC = () => {
  const authHeader = useAuthHeader();
  // Definicja schematu walidacji za pomocą Yup

  // Inicjalizacja formik
  const formik = useFormik({
    initialValues: {
      passphrase: "",
      privateKey: "",
      publicKey: "",
    },
    onSubmit: async (values) => {
      // Logika obsługi wysyłki maila
      let result = await request.post(
        `${config.SERVER_URL}/user/keys/generate`,
        values,
        authHeader()
      );
     
      formik.setFieldValue("privateKey", result.privateKey);
      formik.setFieldValue("publicKey", result.publicKey);
    },
  });

  useEffect(() => {
    request
      .post(`${config.SERVER_URL}/user/get`, {}, authHeader())
      .then((result) => {
        formik.setFieldValue("privateKey", result.privateKey);
        formik.setFieldValue("publicKey", result.publicKey);
      });
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Generuj klucze
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Hasło"
              variant="outlined"
              fullWidth
              required
              name="passphrase"
              value={formik.values.passphrase}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.passphrase && Boolean(formik.errors.passphrase)}
              helperText={formik.touched.passphrase && formik.errors.passphrase}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={10}
              label="Klucz prywatny"
              variant="outlined"
              fullWidth
              disabled
              name="privateKey"
              value={formik.values.privateKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.privateKey && Boolean(formik.errors.privateKey)
              }
              helperText={formik.touched.privateKey && formik.errors.privateKey}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={10}
              label="Klucz publiczny"
              variant="outlined"
              fullWidth
              disabled
              name="publicKey"
              value={formik.values.publicKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.publicKey && Boolean(formik.errors.publicKey)
              }
              helperText={formik.touched.publicKey && formik.errors.publicKey}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Generuj
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default KeyGenerator;
