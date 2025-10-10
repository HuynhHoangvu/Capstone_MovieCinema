import { Route } from "react-router-dom";
import AdminTemplate from "../pages/AdminTemplate";
import AddUserPage from "../pages/AdminTemplate/AddUserPage";
import Auth from "../pages/AdminTemplate/Auth";
import DashBoard from "../pages/AdminTemplate/Dashboard";
import HomeTemplate from "../pages/HomeTemplate";
import DetailPage from "../pages/HomeTemplate/DetailPage";
import HomePage from "../pages/HomeTemplate/HomePage";
import ListMoviePage from "../pages/HomeTemplate/ListMoviePage";
import Login from "../pages/HomeTemplate/LoginPage";
import SignUp from "../pages/HomeTemplate/SignUpPage";
import BookingRoom from "../pages/HomeTemplate/Room";

export const routes = [
  {
    path: "",
    element: HomeTemplate,
    nested: [
      { path: "", element: HomePage },
      { path: "list-movie", element: ListMoviePage },
      { path: "detail/:id", element: DetailPage,hiddenNav:false  },
      { path: "login", element: Login},
      { path: "sign-up", element: SignUp},
      { path: "room/:maLichChieu", element: BookingRoom}
    ],
  },
  {
    path: "admin",
    element: AdminTemplate,
    nested: [
      { path: "dashboard", element: DashBoard },
      { path: "add", element: AddUserPage },
    ],
  },
  {
    path: "auth",
    element: Auth,
  },
];

export const renderRoutes = () => {
  return routes.map((route) => {
    if (route.nested) {
      return (
        <Route key={route.path} path={route.path} element={<route.element />}>
          {route.nested.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<item.element />}
            />
          ))}
        </Route>
      );
    } else {
      return (
        <Route key={route.path} path={route.path} element={<route.element />} />
      );
    }
  });
};
