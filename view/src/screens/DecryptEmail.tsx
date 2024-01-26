import React from "react";
import { Container } from "@mui/material";
import EmailDecryptor from "../EmailDecryptor";

const DecryptEmail: React.FC = () => {
  return (
    <div style={{display: 'flex'}}>
      <Container maxWidth="sm">
        <EmailDecryptor/>
      </Container>
    </div>
  );
};

export default DecryptEmail;
