import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
