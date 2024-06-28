"use client";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ToastComponent() {
  return (
    <ToastContainer
      position='top-right'
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      draggable
      pauseOnHover
    />
  );
}

export default ToastComponent;