import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService"; // Giả định apiService đã được cấu hình baseURL

const initialState = {
    loading: false,
    loadingShowTimes: false, // Trạng thái riêng cho lịch chiếu
    data: [], // Lưu trữ: Hệ thống Rạp (API 2)
    showTimeData: [], // Lưu trữ: Lịch Chiếu Hệ thống Rạp (API 1)
    error: null,
    showTimeError: null,
};

export const fetchShow = createAsyncThunk(
    "show/fetchHeThongRap",
    async (_, { rejectWithValue }) => {
        try {
            // Lưu ý: Dữ liệu API này không có "content" lồng trong response
            const response = await api.get("QuanLyRap/LayThongTinHeThongRap");
            return response.data.content; // Trả về toàn bộ data (là mảng)
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchShowTimes = createAsyncThunk(
    "show/fetchLichChieuHeThongRap",
    async (__, { rejectWithValue }) => {
        try {
            // Truyền maNhom vào query string
            const response = await api.get("QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP01");
            return response.data.content; // Dữ liệu trả về có lồng trong "content"
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const showReducer = createSlice({
    name: "showReducer",
    initialState,
    reducers: {
        // Có thể thêm reducer để reset state nếu cần
    },
    extraReducers: (builder) => {
        // --- Xử lý fetchShow (API Hệ thống Rạp) ---
        builder.addCase(fetchShow.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchShow.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload; // Lưu mảng hệ thống rạp
        });

        builder.addCase(fetchShow.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error;
        });

        // --- Xử lý fetchShowTimes (API Lịch Chiếu) ---
        builder.addCase(fetchShowTimes.pending, (state) => {
            state.loadingShowTimes = true;
            state.showTimeError = null;
        });

        builder.addCase(fetchShowTimes.fulfilled, (state, action) => {
            state.loadingShowTimes = false;
            state.showTimeData = action.payload; // Lưu mảng lịch chiếu
        });

        builder.addCase(fetchShowTimes.rejected, (state, action) => {
            state.loadingShowTimes = false;
            state.showTimeError = action.payload || action.error;
        });
    },
});

export default showReducer.reducer;