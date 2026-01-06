import apiClient from "@/lib/apiClient";
import axios from "axios";


export const initiateMail = async (data: any) => {
    const res = await axios.post('/api/send-test-email/', data);
    return res.data;
};