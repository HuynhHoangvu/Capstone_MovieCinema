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
import AddFlim from "../pages/AdminTemplate/AddFilmPage";
import EditFilm from "../pages/AdminTemplate/EditFilmPage";
import ShowTime from "../pages/AdminTemplate/CalendaPage";
import UpdateProfile from "../pages/HomeTemplate/ProfilePage/Profile";
import UserDashboard from "../pages/HomeTemplate/ProfilePage";
import ManageUser from "../pages/AdminTemplate/ManageUser";

export const routes = [
  {
    path: "",
    element: HomeTemplate,
    nested: [
      { path: "", element: HomePage },
      { path: "list-movie", element: ListMoviePage },
      { path: "profile", element: UserDashboard },

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
      { path: "add-user", element: AddUserPage },
      { path: "add-film", element: AddFlim },
      { path: "manage-user", element: ManageUser },

      { path: "dashboard/edit-film/:maPhim", element: EditFilm},
      { path: "dashboard/show-time/:maPhim", element: ShowTime}


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
