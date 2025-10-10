import {createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../services/apiService"

const initialState = {
    loading:false,
    data:null,
    error:null
}
export const fetchBanner = createAsyncThunk("fetchBanner",async(__,{rejectWithValue}) =>{
    try{
        const response = await api.get("QuanLyPhim/LayDanhSachBanner");
        return response.data.content;
    }catch(error){
        return rejectWithValue(error);
    }
})
const bannerReducer = createSlice({
    name: "bannerReducer",
    initialState,
    reducers:{},
     extraReducers: (builder) =>{
            builder.addCase(fetchBanner.pending, (state) => {
                state.loading = true;
            });
    
            builder.addCase(fetchBanner.fulfilled,(state,action)=>{
                state.loading = false;
                state.data =  action.payload;
            })
            builder.addCase(fetchBanner.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error;
    
            })
        }
})
export default bannerReducer.reducer