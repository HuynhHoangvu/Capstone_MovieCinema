import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";


const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const addFilm = createAsyncThunk("addFilm", async (filmData, { rejectWithValue }) => {
    try {
        const response = await api.post("QuanLyPhim/ThemPhimUploadHinh",filmData)
        return response.data.content;
    }
    catch (error) {
     return rejectWithValue(error.response?.data || error.message);
    }
})

const addFilmReducer = createSlice({
    name:"addFilm",
    initialState,
    reducers:{
        resetAddFilmState: (state) => {
            state.loading = false;
            state.data = null;
            state.error = null;
        }
    },
    extraReducers:(builder) =>{
        builder 
                .addCase(addFilm.pending, (state)=>{
                    state.loading = true;
                    state.error= null;
                })
                .addCase(addFilm.fulfilled,(state,action)=>{
                    state.loading = false;
                    state.data = action.payload;
                })
                .addCase(addFilm.rejected, (state,action)=>{
                    state.loading = false;
                    state.error = action.payload;
                })
    },
});
export const {resetAddFilmState} = addFilmReducer.actions;
export default addFilmReducer.reducer;