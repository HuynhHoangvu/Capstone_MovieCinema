import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/apiService";


const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const signUp = createAsyncThunk("signUp", async (user, { rejectWithValue }) => {
    try {
        const response = await api.post("QuanLyNguoiDung/DangKy",user)
        return response.data.content;
    }
    catch (error) {
     return rejectWithValue(error.response?.data || error.message);
    }
})

const signUpReducer = createSlice({
    name:"signUpReducer",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder 
                .addCase(signUp.pending, (state)=>{
                    state.loading = true;
                    state.error= null;
                })
                .addCase(signUp.fulfilled,(state,action)=>{
                    state.loading = false;
                    state.data = action.payload;
                })
                .addCase(signUp.rejected, (state,action)=>{
                    state.loading = false;
                    state.error = action.payload;
                })
    },
});
export default signUpReducer.reducer;