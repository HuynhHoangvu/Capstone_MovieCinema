import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";
const initialState = {
    heThongRap: {
        loading: false,
        data: [], 
        error: null,
    },
    cumRap: {
        loading: false,
        data: [], 
        error: null,
    },
    createSchedule: {
        loading: false,
        success: null,
        error: null,
    }
};


export const fetchHeThongRap = createAsyncThunk(
    "fetchHeThongRap",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("QuanLyRap/LayThongTinHeThongRap");
            return response.data.content;
        } catch (error) {
            return rejectWithValue(error.response?.data?.content || "Lỗi khi lấy Hệ thống Rạp");
        }
    }
);

export const fetchCumRapTheoHeThong = createAsyncThunk(
    "fetchCumRapTheoHeThong ",
    async (maHeThongRap, { rejectWithValue }) => {
        try {
            const response = await api.get(`QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`);
            return response.data.content;
        } catch (error) {
            return rejectWithValue(error.response?.data?.content || "Lỗi khi lấy Cụm Rạp");
        }
    }
);

export const createLichChieu = createAsyncThunk(
    "createLichChieu",
    async (lichChieuData, { rejectWithValue }) => {
        try {
            const response = await api.post("QuanLyDatVe/TaoLichChieu", lichChieuData);
            console.log(response.data.content)
            return response.data.content || "Tạo lịch chiếu thành công!"; // Trả về thông báo thành công
        } catch (error) {
            console.log(lichChieuData)
            return rejectWithValue(error.response?.data?.content || "Lỗi khi tạo lịch chiếu");
        }
    }
);


const scheduleReducer = createSlice({
    name: "scheduleReducer",
    initialState,
    reducers: {
        clearCumRapList: (state) => {
            state.cumRap.data = [];
            state.cumRap.error = null;
        },
        resetCreateScheduleStatus: (state) => {
            state.createSchedule.success = null;
            state.createSchedule.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHeThongRap.pending, (state) => {
            state.heThongRap.loading = true;
            state.heThongRap.error = null;
        });
        builder.addCase(fetchHeThongRap.fulfilled, (state, action) => {
            state.heThongRap.loading = false;
            state.heThongRap.data = action.payload;
        });
        builder.addCase(fetchHeThongRap.rejected, (state, action) => {
            state.heThongRap.loading = false;
            state.heThongRap.error = action.payload;
            state.heThongRap.data = [];
        });

        builder.addCase(fetchCumRapTheoHeThong.pending, (state) => {
            state.cumRap.loading = true;
            state.cumRap.error = null;
            state.cumRap.data = []; 
        });
        builder.addCase(fetchCumRapTheoHeThong.fulfilled, (state, action) => {
            state.cumRap.loading = false;
            state.cumRap.data = action.payload;
        });
        builder.addCase(fetchCumRapTheoHeThong.rejected, (state, action) => {
            state.cumRap.loading = false;
            state.cumRap.error = action.payload;
            state.cumRap.data = [];
        });

        builder.addCase(createLichChieu.pending, (state) => {
            state.createSchedule.loading = true;
            state.createSchedule.error = null;
            state.createSchedule.success = null;
        });
        builder.addCase(createLichChieu.fulfilled, (state, action) => {
            state.createSchedule.loading = false;
            state.createSchedule.success = action.payload;
        });
        builder.addCase(createLichChieu.rejected, (state, action) => {
            state.createSchedule.loading = false;
            state.createSchedule.error = action.payload;
        });
    },
});

export const { clearCumRapList, resetCreateScheduleStatus } = scheduleReducer.actions;
export default scheduleReducer.reducer