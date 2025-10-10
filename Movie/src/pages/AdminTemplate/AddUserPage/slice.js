import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";


const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const addUser = createAsyncThunk("addUser", async (user, { rejectWithValue }) => {
    try {
        const response = await api.post("QuanLyNguoiDung/ThemNguoiDung",user)
        return response.data.content;
    }
    catch (error) {
     return rejectWithValue(error.response?.data || error.message);
    }
})

const addReducer = createSlice({
    name:"addReducer",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder 
                .addCase(addUser.pending, (state)=>{
                    state.loading = true;
                    state.error= null;
                })
                .addCase(addUser.fulfilled,(state,action)=>{
                    state.loading = false;
                    state.data = action.payload;
                })
                .addCase(addUser.rejected, (state,action)=>{
                    state.loading = false;
                    state.error = action.payload;
                })
    },
});
export default addReducer.reducer