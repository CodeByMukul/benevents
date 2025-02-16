import axios from "axios";
   export const getCategories=async()=>{
      const categories=await axios.get('/api/category');

      return categories.data
   }
//Dont really need next query as much of my code is server side
