// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch } from 'react-redux'
// import { setUserData } from '../redux/userSlice'

// function useGetCurrentUser() {
//     const dispatch=useDispatch()
//   useEffect(()=>{
//   const fetchUser=async () => {
//     try {
//            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
//             dispatch(setUserData(result.data))
  
//     } catch (error) {
//         console.log(error)
//     }
// }
// fetchUser()
 
//   },[])
// }

// export default useGetCurrentUser



import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { serverUrl } from '../App';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        // ←←← GUARD: Only fetch if user is not already loaded or token exists
        if (userData?._id) {
            return; // Already have user data
        }

        const fetchUser = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/user/current`,
                    { withCredentials: true }
                );
                dispatch(setUserData(result.data));
            } catch (error) {
                console.error("Error fetching current user:", error.response?.data || error.message);
                // Optionally clear user data on 401/403
                if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch(setUserData(null));
                }
            }
        };

        fetchUser();
    }, [dispatch, userData?._id]);   // Re-check if userData changes

    return null;
}

export default useGetCurrentUser;