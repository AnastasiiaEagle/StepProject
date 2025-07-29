"use client"
import Slidebar from "@/components/menu/slidebar";
import axios from "@/services/axios";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/auth/me');
      console.log(response.data);
    }
    fetchData();
  }, []);

  return (
   <>
   </>
  );
}
