import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './assets/index.css';
import App from './App';
import Login from "./Login"
import { ProtectedRoute } from "components/ProtectedRoute"
import { MessengerProvider } from "context/messenger"
import * as serviceWorker from './serviceWorker';

const root = createRoot(
  document.getElementById("root")
);
root.render(
  <MessengerProvider>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="m" element={<ProtectedRoute><App /></ProtectedRoute>}>
            <Route path=":convoId" element={<ProtectedRoute><App /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </MessengerProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
