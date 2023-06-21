import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import Link from "next/link";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const { Header, Content, Footer } = Layout;
const LayoutComponent = ({ children }) => {
  const [userInfo, setUserInfo] = useState("");
  const navbarLinks = [
    { name: "Items", link: "/items" },
    { name: "Sub Items", link: "/subitems" },
    { name: "Place Order", link: "/order" },
  ];

  useEffect(() => {
    console.log(localStorage.getItem("name"));
    localStorage.getItem("name") && setUserInfo(localStorage.getItem("name"));
  }, []);

  const handleSuccess = (e) => {
    console.log(e);
    axios
      .post("/api/auth/login", {
        email: e.profileObj.email,
        name: e.profileObj.name,
        token: e.tokenId,
        googleId: e.profileObj.googleId,
      })
      .then(({ data }) => {
        console.log({ data });
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        setUserInfo(data.user.name);
      })
      .catch((err) => console.log(err));
  };
  const handleFailure = (e) => {
    console.log(e);
  };
  return (
    <Layout className="layout">
      <Header className="flex">
        <div className="text-white font-bold">
          <Link href={"/"}>
            <a>BrandName</a>
          </Link>
        </div>
        <div className=" flex w-full ml-2 justify-between content-center">
          <div className="flex ml-2">
            {navbarLinks.map((link, i) => {
              return (
                <div className="mx-2 text-white" key={i}>
                  <Link href={link.link}>
                    <a>{link.name}</a>
                  </Link>{" "}
                </div>
              );
            })}
          </div>
          <div>
            {userInfo ? (
              <div className="mx-2 text-white">
                <Link href={"/user"}>
                  <a>{userInfo.split(" ")[0]}</a>
                </Link>{" "}
              </div>
            ) : (
              <GoogleLogin
                clientId="64220251101-obnnh9l9ro2g0a1ih5fbcdlr8mb37vqr.apps.googleusercontent.com"
                onSuccess={handleSuccess}
                onFailure={handleFailure}
                cookiePolicy="single_host_origin"
                render={(renderprops) => (
                  <Button
                    type="primary"
                    onClick={renderprops.onClick}
                    disabled={renderprops.disabled}>
                    Login/ Register
                  </Button>
                )}
              />
            )}
          </div>
        </div>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          {children}
          <ToastContainer />
        </div>
      </Content>
    </Layout>
  );
};

// export const Paginagtion = ({ handleRefresh, fetchData }) => {
//   const [pageNo, setPageNo] = useState(1);
//   useEffect(() => {}, [pageNo]);
//   return <Pagination defaultCurrent={pageNo} total={1000} />;
// };

export default LayoutComponent;
