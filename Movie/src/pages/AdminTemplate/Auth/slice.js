import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";

const adminInfo = localStorage.getItem("ADMIN_INFO") ? JSON.parse(localStorage.getItem("ADMIN_INFO")):null;
const EXP =60*60*60;

const initialState = {
  loading: false,
  data: adminInfo,
  error: null,
};

export const authLogin = createAsyncThunk(
  "auth/login",
  async (user, {dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("QuanLyNguoiDung/DangNhap", user)
      const auth = response.data.content;
      // Check permission user
      if(user.maLoaiNguoiDung === "KhachHang" ||user.maLoaiNguoiDung === "khachHang"){
          // block
          return rejectWithValue({
            response:{
              data: {
                content:"Không có quyền truy cập"
              }
            }
          })
      }

      // Calculate expiration time
      const presentTime = new Date().getTime();
      const exp = presentTime + EXP;

      dispatch(actLogoutTimeout(EXP))

      // Lưu localStorage
      localStorage.setItem("ADMIN_INFO", JSON.stringify(auth));
      localStorage.setItem("ADMIN_INFO_EXP", exp.toString())
      
      return auth;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    authLogout: (state) => {
      state.data = null; 
      state.error = null;
      state.loading = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(authLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default authReducer.reducer;
export const actLogout = () => {
  return (dispatch) => {
    // remove local storage
    localStorage.removeItem("ADMIN_INFO");
    localStorage.removeItem("ADMIN_INFO_EXP");

   // clear state
    dispatch(authReducer.actions.authLogout());
  }
}

const actLogoutTimeout = (exp) => {
    return (dispatch) => {
      setTimeout(()=>{
        console.log("Time out logout");
        dispatch(actLogout());
      },exp)
    }
}
export const tryAutoLogin = () =>{
  return (dispatch) =>{
  const adminInfoString = localStorage.getItem("ADMIN_INFO");
  if(!adminInfoString) return;

  const expString = localStorage.getItem("ADMIN_INFO_EXP");
  if(!expString) return;

  const exp = Number(expString);
  const presentTime = new Date().getTime();
  if(presentTime > exp){
    dispatch(actLogout())
    return;
  }
  dispatch(actLogoutTimeout(exp - presentTime));
  }
}