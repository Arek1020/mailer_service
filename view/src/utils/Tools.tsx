import { useState, ReactNode } from "react";
import { Alert } from "@mui/material";

interface Tools {
  showToast: (text: string) => ReactNode;
  handleResponse: (response: Response) => Promise<any>;
  useLocalStorage: <T>(
    keyName: string,
    defaultValue: T
  ) => [T, (newValue: T) => void];
  // showError: (text: string) => void;
}

const Tools: Tools = {
  showToast: (text: string) => {
    return (
      <Alert variant="outlined" severity="success">
        {text}
      </Alert>
    );
  },
  handleResponse: (response: Response) => {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from API
          localStorage.removeItem("userDetails");
          localStorage.removeItem("sessionToken");
          window.location.href = "/login";
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }

      return Promise.resolve(data);
    });
  },
  useLocalStorage: function <T>(
    keyName: string,
    defaultValue: T
  ): [T, (newValue: T) => void] {
    throw new Error("Function not implemented.");
  },
};

export default Tools;
