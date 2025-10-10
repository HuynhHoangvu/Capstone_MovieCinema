import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../services/apiService";


const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const updateUser = createAsyncThunk("updateUser", async (user, { rejectWithValue }) => {
    try {
        const response = await api.put("QuanLyNguoiDung/CapNhatThongTinNguoiDung",user)
        return response.data.content;
    }
    catch (error) {
     return rejectWithValue(error.response?.data || error.message);
    }
})

const updateReducer = createSlice({
    name:"UpdateReducer",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder 
                .addCase(updateUser.pending, (state)=>{
                    state.loading = true;
                    state.error= null;
                })
                .addCase(updateUser.fulfilled,(state,action)=>{
                    state.loading = false;
                    state.data = action.payload;
                })
                .addCase(updateUser.rejected, (state,action)=>{
                    state.loading = false;
                    state.error = action.payload;
                })
    },
});
export default updateReducer.reducer