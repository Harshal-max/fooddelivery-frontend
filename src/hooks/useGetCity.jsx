// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
// import { setAddress, setLocation } from '../redux/mapSlice'

// function useGetCity() {
//     const dispatch=useDispatch()
//     const {userData}=useSelector(state=>state.user)
//     const apiKey=import.meta.env.VITE_GEOAPIKEY
//     useEffect(()=>{
         
// navigator.geolocation.getCurrentPosition(async (position)=>{
//     console.log(position)
//     const latitude=position.coords.latitude
//     const longitude=position.coords.longitude
//     dispatch(setLocation({lat:latitude,lon:longitude}))
//     const result=await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
//   console.log(result.data)
//     dispatch(setCurrentCity(result?.data?.results[0].city||result?.data?.results[0].county
// ))
//     dispatch(setCurrentState(result?.data?.results[0].state))
//      dispatch(setCurrentAddress(result?.data?.results[0].address_line2 || result?.data?.results[0].address_line1 ))
//   dispatch(setAddress(result?.data?.results[0].address_line2))
// })
//     },[userData])
// }

// export default useGetCity



import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCurrentAddress, 
  setCurrentCity, 
  setCurrentState, 
  setUserData 
} from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';

function useGetCity() {
    const dispatch = useDispatch();
    const { userData, currentCity } = useSelector(state => state.user); // also get currentCity to avoid re-running
    
    const apiKey = import.meta.env.VITE_GEOAPIKEY;
    
    // Prevent running if we already have a city
    const [hasRun, setHasRun] = useState(false);

    const getCityFromCoords = useCallback(async (latitude, longitude) => {
        try {
            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
            );

            const properties = result?.data?.results?.[0] || {};

            const city = properties.city || 
                        properties.county || 
                        properties.town || 
                        properties.suburb || 
                        "Surat"; // Fallback for your area

            const state = properties.state || properties.state_code || "";
            const addressLine = properties.address_line2 || 
                              properties.address_line1 || 
                              properties.formatted || "";

            dispatch(setCurrentCity(city));
            dispatch(setCurrentState(state));
            dispatch(setCurrentAddress(addressLine));
            dispatch(setAddress(addressLine));
            dispatch(setLocation({ lat: latitude, lon: longitude }));

            console.log("✅ City detected:", city);

        } catch (error) {
            console.error("❌ Geoapify error:", error);
            // Fallback to Surat (your location)
            dispatch(setCurrentCity("Surat"));
            dispatch(setCurrentState("Gujarat"));
        }
    }, [apiKey, dispatch]);

    useEffect(() => {
        // Skip if we already have a city or already ran once
        if (hasRun || currentCity) {
            return;
        }

        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            dispatch(setCurrentCity("Surat")); // fallback
            setHasRun(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("📍 Geolocation success:", position);
                const { latitude, longitude } = position.coords;
                
                dispatch(setLocation({ lat: latitude, lon: longitude }));
                getCityFromCoords(latitude, longitude);
                setHasRun(true);
            },
            (error) => {
                console.error("❌ Geolocation error:", error.code, error.message);
                
                // Fallback city when user denies permission or timeout
                dispatch(setCurrentCity("Surat"));
                dispatch(setCurrentState("Gujarat"));
                setHasRun(true);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,        // 10 seconds max
                maximumAge: 300000     // 5 minutes cache
            }
        );
    }, [getCityFromCoords, hasRun, currentCity]); // Better dependencies

    // Optional: Allow manual refresh if needed
    const refreshCity = () => {
        setHasRun(false);
    };

    return { refreshCity }; // if you want to expose refresh
}

export default useGetCity;