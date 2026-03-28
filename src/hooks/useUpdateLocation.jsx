// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
// import { setAddress, setLocation } from '../redux/mapSlice'

// function useUpdateLocation() {
//     const dispatch=useDispatch()
//     const {userData}=useSelector(state=>state.user)
 
//     useEffect(()=>{
// const updateLocation=async (lat,lon) => {
//     const result=await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
//     console.log(result.data)
// }

// navigator.geolocation.watchPosition((pos)=>{
//     updateLocation(pos.coords.latitude,pos.coords.longitude)
// })
//     },[userData])
// }

// export default useUpdateLocation




import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';
import { serverUrl } from '../App';

function useUpdateLocation() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);
    const watchIdRef = useRef(null);   // To clean up watchPosition

    useEffect(() => {
        // ←←← GUARD: Only run when user is logged in
        if (!userData?._id) {
            return;
        }

        const updateLocation = async (lat, lon) => {
            try {
                const result = await axios.post(
                    `${serverUrl}/api/user/update-location`,
                    { lat, lon },
                    { withCredentials: true }
                );
                console.log("Location updated:", result.data);
            } catch (error) {
                console.error("Error updating location:", error.response?.data || error.message);
            }
        };

        // Start watching position only if user is logged in
        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                dispatch(setLocation({ lat: latitude, lon: longitude }));
                updateLocation(latitude, longitude);
            },
            (error) => {
                console.warn("Geolocation watch error:", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000   // 5 minutes
            }
        );

        // Cleanup function
        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [userData?._id, dispatch]);

    return null;
}

export default useUpdateLocation;