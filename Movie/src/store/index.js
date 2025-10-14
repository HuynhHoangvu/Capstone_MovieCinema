import { configureStore } from "@reduxjs/toolkit";
import listMovieReducer from "../pages/HomeTemplate/ListMoviePage/slice";
import detailReducer from "../pages/HomeTemplate/DetailPage/slice";
import authReducer from "../pages/AdminTemplate/Auth/slice";
import addReducer from "../pages/AdminTemplate/AddUserPage/slice";
import userReducer from "../pages/HomeTemplate/LoginPage/slice";
import bannerReducer from "../pages/HomeTemplate/BannerPage/slice";
import showtimeDetailSlice from "../pages/HomeTemplate/DetailPage/showtimeDetailSlice";
import signUpReducer from "../pages/HomeTemplate/SignUpPage/slice";
import roomReducer from "../pages/HomeTemplate/Room/slice";
import movieReducer from "../pages/AdminTemplate/Dashboard/slice";
import addFilmReducer from "../pages/AdminTemplate/AddFilmPage/slice";
import editFilmReducer from "../pages/AdminTemplate/EditFilmPage/slice";
import deleteFilmReducer from "../pages/AdminTemplate/DeleteFilm/slice";
import scheduleReducer from "../pages/AdminTemplate/CalendaPage/slice";
import updateReducer from "../pages/HomeTemplate/ProfilePage/Profile/slice";
import bookingReducer from "../pages/HomeTemplate/ProfilePage/BookingPage/slice";
import manageUserSlice from "../pages/AdminTemplate/ManageUser/slice";
export const store = configureStore({
    reducer:{
        listMovieReducer,
        detailReducer,
        authReducer,
        addReducer,
        userReducer,
        bannerReducer,
        showtimeDetail: showtimeDetailSlice,
        signUpReducer,
        roomReducer,
        movieReducer,
        addFilmReducer,
        editFilmReducer,
        deleteFilmReducer,
        schedule: scheduleReducer,
        updateReducer,
        bookingReducer,
        manageUserSlice,
    },
})