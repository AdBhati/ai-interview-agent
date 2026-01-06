import { JobDescription } from "@/app/(protected)/job-description/page";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
    resumeData: Object | null;
    jobDescriptions: JobDescription[]
    userRole: "candidate" | "hr" | "admin" | ""
    isLogin: boolean
};

const initialState: AppState = {
    resumeData: null,
    jobDescriptions: [],
    userRole: "",
    isLogin: false
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        updateResumeData: (state, action: any) => {
            state.resumeData = action.payload;
        },
        updateJobDescriptions: (state, action: PayloadAction<JobDescription[]>) => {
            state.jobDescriptions = [...action.payload];
        },
        updateUserRole: (state, action: PayloadAction<"candidate" | "hr" | "admin" | "">) => {
            state.userRole = action.payload;
        },
        updateIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        }
    },
});

export const { updateResumeData, updateJobDescriptions, updateUserRole, updateIsLogin } = appSlice.actions;
export default appSlice.reducer;
