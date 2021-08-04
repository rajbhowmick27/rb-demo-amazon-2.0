import { Provider } from "react-redux";
import { store } from "../app/store";
import "../styles/globals.css";
import "regenerator-runtime/runtime";


import { Provider as AuthProvider } from "next-auth/client";

const MyApp = ({ Component, pageProps }) => {
  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  );
};

export default MyApp;
