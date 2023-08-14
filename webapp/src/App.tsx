import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home/Home";
import { MyPosts } from "./pages/MyPosts/MyPosts";
import { SideBar } from "./components/SideBar";
import { Authentication } from "./pages/Authentication/Authentication";
import { ConstRoutes } from "./constants/Routes";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import { NotFound } from "./pages/NotFound";
import { useEffect } from "react";
import { auth } from "../firebase";

export const App = () => {
  useEffect(() => {
    const dark = window.localStorage.getItem("theme") ?? "light";

    const root = document.getElementsByTagName("html")[0];
    root.classList.add(dark);
  });

  useEffect(() => {
    console.log(localStorage.getItem("user"));

    // if (
    //   !auth.currentUser &&
    //   (
    //     [
    //       ConstRoutes.FORGOT_PASSWORD,
    //       ConstRoutes.REGISTER,
    //       ConstRoutes.LOGIN,
    //     ] as string[]
    //   ).includes(window.location.pathname)
    // ) {
    //   window.location.replace(ConstRoutes.LOGIN);
    // }
  }, []);

  return (
    <BrowserRouter>
      <SideBar />
      <Routes>
        <Route path={ConstRoutes.HOME} element={<Home />} />
        <Route path={ConstRoutes.PROFILE} element={<MyPosts />} />

        <Route
          path={ConstRoutes.LOGIN}
          element={<Authentication isLogin={true} />}
        />
        <Route
          path={ConstRoutes.REGISTER}
          element={<Authentication isLogin={false} />}
        />
        <Route
          path={ConstRoutes.FORGOT_PASSWORD}
          element={<ForgotPassword />}
        />

        <Route path={ConstRoutes.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
