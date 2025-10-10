import { configureStore } from "@reduxjs/toolkit";
import listMovieReducer from "../pages/HomeTemplate/ListMoviePage/slice";
import detailReducer from "../pages/HomeTemplate/DetailPage/slice";
import authReducer from "../pages/AdminTemplate/Auth/slice";
import addReducer from "../pages/AdminTemplate/AddUserPage/slice";
import userReducer from "../pages/HomeTemplate/LoginPage/slice";
import bannerReducer from "../pages/HomeTemplate/BannerPage/slice";
import showReducer from "../pages/HomeTemplate/showTime/slice";
import showtimeDetailSlice from "../pages/HomeTemplate/DetailPage/showtimeDetailSlice";
import signUpReducer from "../pages/HomeTemplate/SignUpPage/slice";
import roomReducer from "../pages/HomeTemplate/Room/slice";
export const store = configureStore({
    reducer:{
        listMovieReducer,
        detailReducer,
        authReducer,
        addReducer,
        userReducer,
        bannerReducer,
        showReducer,
        showtimeDetail: showtimeDetailSlice,
        signUpReducer,
        roomReducer
    },
})