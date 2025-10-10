import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Thay thế bằng đường dẫn thực tế đến Axios instance của bạn
// Ví dụ: import api from 'path/to/your/apiInstance';
import api from '../../../services/apiService';
const initialState = {
  loading: false,
  data: null, // Chứa dữ liệu lịch chiếu chi tiết theo phim
  error: null,
};

// **API:** /api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim={maPhim}
export const fetchShowtimeByMovie = createAsyncThunk(
  "showtimeDetail/fetchShowtimeByMovie",
  async (maPhim, { rejectWithValue }) => {
    try {
      const response = await api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`);

      
      return response.data.content; 
      
    } catch (err) {

      return rejectWithValue(err.response?.data?.content || err.message || 'Lỗi tải lịch chiếu phim');
    }
  }
);

const showtimeDetailSlice = createSlice({
  name: 'showtimeDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowtimeByMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchShowtimeByMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Dữ liệu content
      })
      .addCase(fetchShowtimeByMovie.rejected, (state, action) => {
        state.loading = false;
        // Lỗi được truyền từ rejectWithValue
        state.error = action.payload; 
        state.data = null;
      });
  },
});

export default showtimeDetailSlice.reducer;