import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { AuthProvider} from '../lib/authcontext'
export default function App({ Component, pageProps }: AppProps) {
  return <>
  <head>
    <title>Code-Stack</title>
    </head>
    <AuthProvider>
    <ToastContainer aria-label="toast-container" />
  <Component {...pageProps} />
    </AuthProvider>
  </>;
}
