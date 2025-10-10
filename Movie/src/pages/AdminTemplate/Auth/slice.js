import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";
const adminInfo = localStorage.getItem("ADMIN_INFO") ? JSON.parse(localStorage.getItem("ADMIN_INFO")):null;

const initialState = {
  loading: false,
  data: adminInfo,
  error: null,
};

export const authLogin = createAsyncThunk(
  "auth/login",
  async (user, { rejectWithValue }) => {
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
      // Lưu localStorage
      localStorage.setItem("ADMIN_INFO", JSON.stringify(auth));

      return auth;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {},
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
