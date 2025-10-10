import {createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../services/apiService";
const initialState = {
    loading: false,
    data:null,
    error:null
}
const detailReducer = createSlice({
    name:"detailReducer",
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
            builder.addCase(fetchMovieDetail.pending, (state) => {
                state.loading = true;
            });
    
            builder.addCase(fetchMovieDetail.fulfilled,(state,action)=>{
                state.loading = false;
                state.data =  action.payload;
            })
            builder.addCase(fetchMovieDetail.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error;
    
            })
        }
});
export const fetchMovieDetail = createAsyncThunk("fetchMovieDetail",async(id,{rejectedWithValue})=>{
    try{
        const response = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${id}`)
        return response.data.content;
    }catch(err){
        return rejectedWithValue(err);
    }
})
export default detailReducer.reducer;