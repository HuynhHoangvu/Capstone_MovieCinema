import {createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../../services/apiService"


const initialState = {
    loading: false,
    data:null,
    error:null
}
export const fetchBookingHistory  = createAsyncThunk("fetchBookingHistory ",async( __,{rejectWithValue}) =>{
    try{
    const response = await api.post("QuanLyNguoiDung/ThongTinTaiKhoan")
    return response.data.content;
    }catch(err){
        return rejectWithValue(err);
    }
})
const bookingReducer = createSlice({
    name: "bookingReducer",
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
        builder.addCase(fetchBookingHistory .pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchBookingHistory .fulfilled,(state,action)=>{
            state.loading = false;
            state.data =  action.payload;
        })
        builder.addCase(fetchBookingHistory .rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error;

        })
    }
})
export default bookingReducer.reducer;