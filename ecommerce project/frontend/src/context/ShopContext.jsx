import { createContext, useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export  const ShopContext = createContext();
const ShopContextProvider = (props)=>{
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl =  import.meta.env.VITE_BACKEND_URL
    const [search,setSearch]=useState('');
    const [showSearch,setShowSearch]=useState(false);
    const [cartItems,setCartItems]=useState({});
    const[products,setProducts]=useState([])
    const [token,setToken]=useState('')
    const navigate=useNavigate();
//     const addToCart = async(itemId,size)=>{
//         if(!size){
//             toast.error('Select Product Size');
//             return;
//         }
//       let cartData= structuredClone(cartItems);
//       if(cartData[itemId]){
//       if(cartData[itemId][size]){
//           cartData[itemId][size]+=1;
//       }
//       else{
//        cartData[itemId][size]=1;
//     }
//     }
//     else{
//         cartData[itemId]={};
//         cartData[itemId][size]=1;
//     }
//     setCartItems(cartData);
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("token");
//     console.log("User ID in addToCart:", userId);
//     console.log("Token in addToCart:", token);
//     if(token){
//       try{
//           await axios.post(backendUrl + '/api/cart/add',{userId,itemId,size},{headers:{token,userid:userId}})
//       }
//       catch(error){
//           console.log(error)
//           toast.error(error.message)
//       }
//     }
// }
// const addToCart = async (itemId, size) => {
//   if (!size) {
//     toast.error("Select Product Size");
//     return;
//   }

//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   let cartData = structuredClone(cartItems || {});
//   cartData[itemId] = cartData[itemId] || {};
//   cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

//   setCartItems(cartData);

//   if (token) {
//     try {
//       await axios.post(
//         backendUrl + "/api/cart/add",
//         { userId, itemId, size },
//         { headers: { token, userid: userId } }
//       );
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message || "Failed to add to cart");
//     }
//   }
// };

const addToCart = async (itemId, size) => {
  if (!size) {
      toast.error("Select Product Size");
      return;
  }

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  let cartData = structuredClone(cartItems || {});
  cartData[itemId] = cartData[itemId] || {};
  cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

  setCartItems(cartData);

  if (token) {
      try {
          await axios.post(
              `${backendUrl}/api/cart/add`,
              { itemId, size },
              { headers: { userid: userId, token } }
          );
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Failed to add to cart");
      }
  }
};

// const getCartCount=()=>{
//     let totalCount=0;
//     for(const items in cartItems){
//         for(const item in cartItems[items]){
//             try{
//                 if(cartItems[items][item]>0){
//                    totalCount+=cartItems[items][item];
//                 }
//             }catch(error){
//               console.log(error)
//               toast.error(error.message)
//             }
//         }
//     }
//     return totalCount;
// }
const getCartCount = () => {
  if (!cartItems || Object.keys(cartItems).length === 0) return 0;

  let totalCount = 0;
  for (const items in cartItems) {
    for (const item in cartItems[items]) {
      totalCount += cartItems[items][item] || 0;
    }
  }
  return totalCount;
};

// const updateQuantity=async(itemId,size,quantity)=>{
//    let cartData=structuredClone(cartItems);
//    cartData[itemId][size]=quantity;
//    setCartItems(cartData);
//    if (quantity === 0) {
//     delete cartData[itemId][size];
//     if (Object.keys(cartData[itemId]).length === 0) {
//       delete cartData[itemId];
//     }
//   } else {
//     if (!cartData[itemId]) cartData[itemId] = {};
//     cartData[itemId][size] = quantity;
//   }
//   setCartItems(cartData);
//   //  if(token){
//   //   try{
//   //   await axios.post(backendUrl + '/api/cart/update',{itemId,size,quantity} ,{headers:{token}})
//   //   }
//   //   catch(error){
//   //     console.log(error)
//   //     toast.error(error.message)
//   //   }
//   //  }
//   if (token) {
//     try {
//       const response = await axios.post(
//         backendUrl + "/api/cart/update",
//         { itemId, size, quantity },
//         { headers: { userid: localStorage.getItem("userId"), token } }
//       );
//       if (response.data.success) {
//         setCartItems(response.data.cartData); // Update state with backend data
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   }
// }
const updateQuantity = async (itemId, size, quantity) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  let cartData = structuredClone(cartItems || {});
  if (quantity === 0) {
      delete cartData[itemId]?.[size];
      if (Object.keys(cartData[itemId] || {}).length === 0) delete cartData[itemId];
  } else {
      cartData[itemId] = cartData[itemId] || {};
      cartData[itemId][size] = quantity;
  }

  setCartItems(cartData);

  if (token) {
      try {
          await axios.post(
              `${backendUrl}/api/cart/update`,
              { itemId, size, quantity },
              { headers: { userid: userId, token } }
          );
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Failed to update quantity");
      }
  }
};

const getCartAmount = ()=>{
  let totalAmount=0;
  for(const items in cartItems){
    let itemInfo=products.find((product)=>product._id===items);
    for(const item in cartItems[items]){
        try{
              if(cartItems[items][item]>0){
                totalAmount+=itemInfo.price * cartItems[items][item]
              }
        } catch(error){

        }
    }
  }
  return totalAmount;
}
// const getProductsData= async () => {
//     try{
//      const response = await axios.get(backendUrl + '/api/product/list')
//      if(response.data.success){
//         setProducts(response.data.products)
//      }else{
//         toast.error(response.data.message)
//      }
//     }
//     catch(error){
//          console.log(error)
//          toast.error(error.message)
//     }
// }
const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
     // Log products data
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error fetching products:', error); // Add error log
      toast.error(error.message);
    }
  };
  // const getUserCart=async(token)=>{
  //   try{
  //    const response =await axios.get(backendUrl + '/api/cart/get',{},{headers:{token}})
  //    console.log("Cart data retrieved:", response.data);
  //    if(response.data.success){
  //     setCartItems(response.data.cartData)
  //    }
  //   }
  //   catch(error){
  //       console.log(error)
  //       toast.error(error.message)
  //   }
  // }
  const getUserCart = async () => {
    try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const response = await axios.get(`${backendUrl}/api/cart/get`, {
            headers: { userid: userId, token },
        });

        if (response.data.success) {
            setCartItems(response.data.cartData || {});
        } else {
            toast.error(response.data.message || "Failed to fetch cart");
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message || "Error fetching cart");
    }
};

//   const getUserCart = async () => {
//   try {
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("token");

//     if (!userId) throw new Error("User ID is not available");

//     const response = await axios.get(`${backendUrl}/api/cart/get`, {
//       headers: {
//         userid: userId,
//         token,
//       },
//     });

//     console.log("Cart data retrieved:", response.data);

//     // Update state directly
//     if (response.data.success && response.data.cartData) {
//       setCartItems(response.data.cartData); // Fix state update
//     } else {
//       toast.error(response.data.message);
//     }
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     toast.error("Failed to fetch cart");
//   }
// };

// const deleteFromCart = async (itemId, size) => {
//   // Make a copy of cartItems to modify
//   let cartData = structuredClone(cartItems);

//   // Check if the item and size exist in the cart
//   if (cartData[itemId] && cartData[itemId][size]) {
//       // Delete the specific size from the cart
//        cartData[itemId][size]=-1;

//       // If there are no more sizes for the item, delete the item completely
//       if (Object.keys(cartData[itemId]).length === 0) {
//           delete cartData[itemId];
//       }
//   }

//   // Update the local state with the modified cart
//   setCartItems(cartData);

//   // Get the userId and token from localStorage
//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   // If a token exists, proceed to update the backend
//   if (token) {
//       try {
//           // Send request to the backend to update the user's cart
//           const response = await axios.post(
//               backendUrl + "/api/cart/update", 
//               { itemId, size, quantity: 0 }, // Set quantity to 0 to delete
//               { headers: { userid: userId, token } }
//           );

//           // If the update is successful, update the cartItems state with the response data
//           if (response.data.success) {
//               setCartItems(response.data.cartData);
//           } else {
//               toast.error(response.data.message);
//           }
//       } catch (error) {
//           console.log(error);
//           toast.error(error.message);
//       }
//   }
// };

useEffect(()=>{
getProductsData()
},[products])
// useEffect(()=>{
//     if(!token && localStorage.getItem('token')){
//      setToken(localStorage.getItem('token'))
//      getUserCart(localStorage.getItem('token'))
//     }
// },[])
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    getUserCart();
  }
}, []); 
useEffect(() => {
  console.log("Current cartItems state:", cartItems);
}, [cartItems]);
// Runs once on component mount

    const value={
       products,currency,delivery_fee,search,setSearch,showSearch,setShowSearch,cartItems,setCartItems,addToCart,getCartCount,updateQuantity,getCartAmount,navigate,backendUrl,token,setToken
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;