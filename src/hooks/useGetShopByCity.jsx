// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import { setShopsInMyCity, setUserData } from '../redux/userSlice'

// function useGetShopByCity() {
//     const dispatch=useDispatch()
//     const {currentCity}=useSelector(state=>state.user)
//   useEffect(()=>{
    
//   const fetchShops=async () => {
//     try {
//            const result=await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true})
//             dispatch(setShopsInMyCity(result.data))
//            console.log(result.data)
//     } catch (error) {
//         console.log(error)
//     }
// }
// fetchShops()
 
//   },[currentCity])
// }

// export default useGetShopByCity



import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice';
import { serverUrl } from '../App';

function useGetShopByCity() {
    const dispatch = useDispatch();
    const { currentCity } = useSelector(state => state.user);

    useEffect(() => {
        // ←←← GUARD: Prevent API call when city is null or empty
        if (!currentCity || currentCity === "null" || currentCity.trim() === "") {
            dispatch(setShopsInMyCity([]));
            return;
        }

        const fetchShops = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/shop/get-by-city/${currentCity}`,
                    { withCredentials: true }
                );
                dispatch(setShopsInMyCity(result.data || []));
            } catch (error) {
                console.error("Error fetching shops by city:", error.response?.data || error.message);
                dispatch(setShopsInMyCity([])); // safe fallback
            }
        };

        fetchShops();
    }, [currentCity, dispatch]);

    return null;
}

export default useGetShopByCity;