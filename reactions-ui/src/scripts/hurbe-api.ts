import type { Stream } from "@/types";
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const HurbeAPI = {
  async getStream(streamId: string): Promise<Stream | null> {
    try {
      const response = await client.get(`/streams/${streamId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default HurbeAPI;
