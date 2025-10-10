import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService"; // Giả định đường dẫn này là đúng

const initialState = {
    loading: false,
    data: [], // Thay đổi từ null thành mảng rỗng để dễ xử lý map() trong component
    error: null,
};

// 1. Định nghĩa Async Thunk để gọi API
export const fetchDashboard = createAsyncThunk("movie/fetchDashboard", async (_, { rejectWithValue }) => {
    try {
        // Gọi API lấy danh sách phim
        const response = await api.get("QuanLyPhim/LayDanhSachPhim?maNhom=GP01");
        return response.data.content;
    } catch (error) {
        // Sử dụng action.payload trong rejected case
        return rejectWithValue(error.response?.data?.content || "Lỗi không xác định");
    }
});

// 2. Định nghĩa Slice
const movieReducer = createSlice({
    name: "movieReducer", // Đổi tên cho phù hợp
    initialState,
    reducers: {
        // Có thể thêm các reducers đồng bộ khác ở đây (ví dụ: xoá phim cục bộ)
    },
    extraReducers: (builder) => {
        // Xử lý trạng thái Pending (Đang tải)
        builder.addCase(fetchDashboard.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Xử lý trạng thái Fulfilled (Thành công)
        builder.addCase(fetchDashboard.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload; // Gán dữ liệu phim vào state.data
        });

        // Xử lý trạng thái Rejected (Thất bại)
        builder.addCase(fetchDashboard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.data = []; // Xóa dữ liệu cũ nếu lỗi
        });
    },
});

// 3. Export reducer
export default movieReducer.reducer;