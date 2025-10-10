import {createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../services/apiService"


const initialState = {
    loading: false,
    data:null,
    error:null
}
export const roomFetch = createAsyncThunk("roomFetch",async( maLichChieu,{rejectWithValue}) =>{
    try{
    const response = await api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`)
    return response.data.content;
    }catch(err){
        return rejectWithValue(err);
    }
})
const roomReducer = createSlice({
    name: "listMovieReducer",
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
        builder.addCase(roomFetch.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = null; 
        });

        builder.addCase(roomFetch.fulfilled,(state,action)=>{
            state.loading = false;
            state.data =  action.payload;
        })
        builder.addCase(roomFetch.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error;

        })
    }
})
export default roomReducer.reducer;