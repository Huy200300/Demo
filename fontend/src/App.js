import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routers } from "./routers";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { isJsonString } from "./untils";
import jwt_decode from "jwt-decode";
import * as userService from "./services/userService";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slides/userSlice";
import { LoadingComponent } from "./components/LoadingComponent/LoadingComponent";
import AdminPage from "./pages/AdminPage/AdminPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  const dispatch = useDispatch();
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecode();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);

  const handleDecode = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData);
    }
    return { decoded, storageData };
  };

  userService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecode();

      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await userService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await userService.getUsersDetail(id, token);
    dispatch(
      updateUser({
        ...res?.data,
        access_token: token,
        refreshToken: refreshToken,
      })
    );
  };
  return (
    <div>
      <LoadingComponent isLoading={isloading}>
        <Router>
          <Routes>
            {routers.map((router) => {
              const Pages = router.page;
              const Layout = router.isShowHeader ? DefaultComponent : Fragment;
              return (
                <>
                  <Route
                    key={router.path}
                    path={router.path}
                    element={
                      <Layout>
                        {/* <IsAdminPage> */}
                        <Pages />
                        {/* </IsAdminPage> */}
                      </Layout>
                    }
                  />
                </>
              );
            })}
          </Routes>
        </Router>
      </LoadingComponent>
    </div>
  );
}

export default App;
