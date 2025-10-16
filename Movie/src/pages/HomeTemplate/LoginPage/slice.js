import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";
import { updateUser } from "../ProfilePage/Profile/slice";

const userInfo = localStorage.getItem("USER_INFO") ? JSON.parse(localStorage.getItem("USER_INFO")) : null;


const initialState = {
  loading: false,
  data: userInfo,
  error: null
}

export const userLogin = createAsyncThunk("user/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await api.post("QuanLyNguoiDung/DangNhap", user);
      const auth = response.data.content;

      // Kiểm tra quyền từ dữ liệu trả về
      if (auth.maLoaiNguoiDung === "QuanTri") {
        return rejectWithValue({
          response: {
            data: {
              content: "Không có quyền truy cập",
            },
          },
        });
      }

      localStorage.setItem("USER_INFO", JSON.stringify(auth));
      return auth;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.loading = null;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        localStorage.setItem("USER_INFO", JSON.stringify(action.payload));
      });
  },
});
export const { logout } = userReducer.actions;
export default userReducer.reducer;
export const actLogout = (dispatch) => {
  // remove local storage
  localStorage.removeItem("ADMIN_INFO");
  // clear state
  dispatch(userReducer.actions.logoutUser())
}