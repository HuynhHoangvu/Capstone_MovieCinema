import {createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../services/apiService"


const initialState = {
    loading: false,
    data:null,
    error:null,
    bookingLoading: false,
    bookingError: null,
}
export const roomFetch = createAsyncThunk("roomFetch",async( maLichChieu,{rejectWithValue}) =>{
    try{
    const response = await api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`)
    return response.data.content;
    }catch(err){
        return rejectWithValue(err);
    }
})
export const bookTicket = createAsyncThunk(
    "bookTicket",
    async (bookingData, { rejectWithValue }) => {
        try {
            // API đặt vé sử dụng phương thức POST
            const response = await api.post("QuanLyDatVe/DatVe", bookingData);
            // API trả về thông báo thành công sau khi đặt
            return response.data.content; 
        } catch (err) {
            // Lấy thông báo lỗi chi tiết từ API nếu có
            return rejectWithValue(err.response?.data?.content || err.message);
        }
    }
);
const roomReducer = createSlice({
    name: "listMovieReducer",
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
        builder.addCase(roomFetch.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = null; 
        })

        .addCase(roomFetch.fulfilled,(state,action)=>{
            state.loading = false;
            state.data =  action.payload;
        })
      .addCase(roomFetch.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error;

        })
         .addCase(bookTicket.pending, (state) => {
                state.bookingLoading = true;
                state.bookingError = null;
            })
            .addCase(bookTicket.fulfilled,(state,action)=>{
                state.bookingLoading = false;
               state.data =  action.payload;

            })
            .addCase(bookTicket.rejected,(state,action)=>{
                state.bookingLoading = false;
                state.bookingError = action.payload; 
            });
    }
})
export default roomReducer.reducer;