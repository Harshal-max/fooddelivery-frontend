// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import { setMyOrders, setUserData } from '../redux/userSlice'
// import { setMyShopData } from '../redux/ownerSlice'

// function useGetMyOrders() {
//     const dispatch=useDispatch()
//     const {userData}=useSelector(state=>state.user)
//   useEffect(()=>{
//   const fetchOrders=async () => {
//     try {
//            const result=await axios.get(`${serverUrl}/api/order/my-orders`,{withCredentials:true})
//             dispatch(setMyOrders(result.data))
   


//     } catch (error) {
//         console.log(error)
//     }
// }
//   fetchOrders()

 
  
//   },[userData])
// }

// export default useGetMyOrders




import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMyOrders } from '../redux/userSlice';
import { serverUrl } from '../App';

function useGetMyOrders() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        // ←←← GUARD: Only fetch when user is logged in
        if (!userData?._id) {
            dispatch(setMyOrders([]));
            return;
        }

        const fetchOrders = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/order/my-orders`,
                    { withCredentials: true }
                );
                dispatch(setMyOrders(result.data || []));
            } catch (error) {
                console.error("Error fetching my orders:", error.response?.data || error.message);
                dispatch(setMyOrders([]));
            }
        };

        fetchOrders();
    }, [userData?._id, dispatch]);

    return null;
}

export default useGetMyOrders;