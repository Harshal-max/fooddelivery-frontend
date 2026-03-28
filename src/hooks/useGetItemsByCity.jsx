// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import { setItemsInMyCity, setShopsInMyCity, setUserData } from '../redux/userSlice'

// function useGetItemsByCity() {
//     const dispatch=useDispatch()
//     const {currentCity}=useSelector(state=>state.user)
//   useEffect(()=>{
//   const fetchItems=async () => {
//     try {
//            const result=await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
//             dispatch(setItemsInMyCity(result.data))
//            console.log(result.data)
//     } catch (error) {
//         console.log(error)
//     }
// }
// fetchItems()
 
//   },[currentCity])
// }

// export default useGetItemsByCity



import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItemsInMyCity } from '../redux/userSlice';
import { serverUrl } from '../App';

function useGetItemsByCity() {
    const dispatch = useDispatch();
    const { currentCity } = useSelector(state => state.user);

    useEffect(() => {
        // ←←← IMPORTANT GUARD: Prevent call when city is null or invalid
        if (!currentCity || currentCity === "null" || currentCity.trim() === "") {
            dispatch(setItemsInMyCity([]));
            return;
        }

        const fetchItems = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/item/get-by-city/${currentCity}`,
                    { withCredentials: true }
                );
                dispatch(setItemsInMyCity(result.data || []));
            } catch (error) {
                console.error("Error fetching items by city:", error.response?.data || error.message);
                dispatch(setItemsInMyCity([])); // safe fallback
            }
        };

        fetchItems();
    }, [currentCity, dispatch]);

    return null;
}

export default useGetItemsByCity;