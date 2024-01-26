import React from "react";
import { Container } from "@mui/material";
import EmailSender from "../EmailSender";
import KeyGenerator from "../KeyGenerator";

const ComposeEmail: React.FC = () => {
  return (
    <div style={{display: 'flex'}}>
      <Container maxWidth="sm">
        <KeyGenerator />
      </Container>
      <Container maxWidth="sm">
        <EmailSender />
      </Container>
    </div>
  );
};

export default ComposeEmail;
