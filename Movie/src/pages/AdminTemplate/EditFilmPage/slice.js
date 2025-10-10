import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";


const initialState = {
    loading: false,
    data: null,
    error: null,
    filmDetail: null, 
    detailLoading: false,
    detailError: null,
};


export const fetchFilmDetail = createAsyncThunk(
    "editFilm/fetchFilmDetail", 
    async (maPhim, { rejectWithValue }) => {
        try {
            const response = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`); 
            return response.data.content;
        }
        catch (error) {
           return rejectWithValue(error.response?.data?.content || error.message);
        }
    }
);

export const editFilm = createAsyncThunk(
    "editFilm/editFilm", 
   
    async (film, { rejectWithValue }) => {
        try {
            const response = await api.post("QuanLyPhim/CapNhatPhimUpload", film);
            return response.data.content;
        }
        catch (error) {
           return rejectWithValue(error.response?.data?.content || error.response?.data || error.message);
        }
    }
);

const editFilmReducer = createSlice({
    name: "editFilmReducer", 
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder 
                .addCase(fetchFilmDetail.pending, (state) => {
                    state.detailLoading = true;
                    state.detailError = null;
                })
                .addCase(fetchFilmDetail.fulfilled, (state, action) => {
                    state.detailLoading = false;
                    state.filmDetail = action.payload;
                })
                .addCase(fetchFilmDetail.rejected, (state, action) => {
                    state.detailLoading = false;
                    state.detailError = action.payload;
                })

                .addCase(editFilm.pending, (state)=>{
                    state.loading = true;
                    state.error= null;
                })
                .addCase(editFilm.fulfilled,(state,action)=>{
                    state.loading = false;
                    state.data = action.payload;
                })
                .addCase(editFilm.rejected, (state,action)=>{
                    state.loading = false;
                    state.error = action.payload;
                })
    },
});

export default editFilmReducer.reducer;