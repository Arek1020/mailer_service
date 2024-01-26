import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Input,
} from "@mui/material";
import config from "./config";
import { useAuthHeader } from "react-auth-kit";
import request from "./request";

const EmailSender: React.FC = () => {
  const authHeader = useAuthHeader();
  // Definicja schematu walidacji za pomocą Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    subject: Yup.string().required("Required"),
    message: Yup.string().required("Required"),
  });

  // Inicjalizacja formik
  const formik = useFormik({
    initialValues: {
      email: "",
      subject: "",
      message: "",
      password: "",
      attachments: [] as File[],
      receivers: [{}],
    },
    validationSchema,
    onSubmit: async (values) => {
      // Logika obsługi wysyłki maila

      values.receivers = [{ email: values.email }];
      console.log("Wysyłanie maila z danymi:", values);
      const formData = new FormData();
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          console.log("kkk", key);
          if (key === "attachments")
            for (let file of values[key]) formData.append(key, file);
          else if (key === "receivers")
            formData.append(key, JSON.stringify(values[key]));
          else if (
            key === "email" ||
            key === "subject" ||
            key === "message" ||
            key === "password"
          )
            formData.append(key, values[key] + "");
        }
      }
      console.log("Wysyłanie maila z danymi formdata:", formData);
      let result = await request.post(
        `${config.SERVER_URL}/mail/sendWithAttachments`,
        formData,
        authHeader()
      );
      // let result = fetch(`${config.SERVER_URL}/sendWithAttachments`, {
      //   method: "post",
      //   headers: { Authorization: authHeader() },
      //   body: formData,
      // });
      console.log("resuuuultt", result);
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Wpisz treść wiadomości
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Adres e-mail"
              variant="outlined"
              fullWidth
              required
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Temat"
              variant="outlined"
              fullWidth
              required
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Treść wiadomości"
              variant="outlined"
              multiline
              rows={6}
              fullWidth
              required
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              type="file"
              inputProps={{ multiple: true }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue("attachments", event.currentTarget.files);
              }}
            />
          </Grid>
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
              Wyślij maila
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EmailSender;
