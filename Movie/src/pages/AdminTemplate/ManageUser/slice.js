import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService"; // Đảm bảo đường dẫn này đúng

const initialState = {
    loading: false,
    data: [], // Lưu danh sách người dùng
    error: null,
};

// 1. Định nghĩa Async Thunk để gọi API Lấy danh sách người dùng
export const fetchUserList = createAsyncThunk(
    "manageUser/fetchUserList", 
    // Trong thực tế, API này có thể cần tham số 'soTrang' và 'soPhanTuTrenTrang' để phân trang
    async (maNhom = "GP01", { rejectWithValue }) => {
        try {
            const response = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`);
            // response.data.content là mảng người dùng
            return response.data.content; 
        } catch (error) {
            // Xử lý lỗi từ server (ví dụ: 401, 404, 500)
            return rejectWithValue(error.response?.data?.content || "Lỗi không xác định khi tải danh sách người dùng.");
        }
    }
);

// 2. Định nghĩa Slice
const manageUserSlice = createSlice({
    name: "manageUser", 
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Xử lý trạng thái Pending (Đang tải)
        builder.addCase(fetchUserList.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Xử lý trạng thái Fulfilled (Thành công)
        builder.addCase(fetchUserList.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload; // Gán danh sách người dùng
        });

        // Xử lý trạng thái Rejected (Thất bại)
        builder.addCase(fetchUserList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message; 
        });
    },
});

export default manageUserSlice.reducer;