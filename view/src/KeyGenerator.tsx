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
      password: "",
      privateKey: "",
      publicKey: "",
    },
    onSubmit: async (values) => {
      // Logika obsługi wysyłki maila

      console.log("Wysyłanie maila z danymi:", values);

      let result = await request.post(
        `${config.SERVER_URL}/user/keys/generate`,
        values,
        authHeader()
      );
      // let result = fetch(`${config.SERVER_URL}/sendWithAttachments`, {
      //   method: "post",
      //   headers: { Authorization: authHeader() },
      //   body: formData,
      // });
      console.log("resuuuultt", result);
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
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={10}
              label="Klucz prywatny"
              variant="outlined"
              fullWidth
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
