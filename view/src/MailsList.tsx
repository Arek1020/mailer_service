// Importowanie niezbędnych modułów
import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

// Deklaracja typów dla maila
interface Mail {
  id: number;
  sender: string;
  subject: string;
  content: string;
}

// Deklaracja typów dla komponentu
interface MailsListProps {
  sentMails: Mail[];
}

// Komponent listy wysłanych maili
const MailsList: React.FC<MailsListProps> = ({ sentMails }) => {
  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Wysłane maile
      </Typography>
      <List>
        {sentMails.map((mail) => (
          <React.Fragment key={mail.id}>
            <ListItem>
              <ListItemText
                primary={mail.subject}
                secondary={`Od: ${mail.sender}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText secondary={mail.content} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default MailsList;
