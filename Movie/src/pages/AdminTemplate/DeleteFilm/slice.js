import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";


const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const deleteFilm = createAsyncThunk("deleteFilm", async (maPhim, { rejectWithValue }) => {
    try {
        const response = await api.delete(`QuanLyPhim/XoaPhim?MaPhim=${maPhim}`)
        return response.data.content;
    }
    catch (error) {
     return rejectWithValue(error.response?.data || error.message);
    }
})

const deleteFilmReducer = createSlice({
    name:"deleteFilmReducer",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder 
                .addCase(deleteFilm.pending, (state)=>{
                    state.loading = true;
                    state.error= null;
                })
                .addCase(deleteFilm.fulfilled,(state,action)=>{
                    state.loading = false;
                    state.data = action.payload;
                })
                .addCase(deleteFilm.rejected, (state,action)=>{
                    state.loading = false;
                    state.error = action.payload;
                })
    },
});
export default deleteFilmReducer.reducer;