"use client"
import axios from "axios"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { formUrlQuery, handleError, removeKeysFromQuery } from "@/lib/utils"
import { Input } from "../ui/input"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
const CategoryFilter= () => {
  interface ICategory{
   id:string;
    name: string;
  }
  const [categories, setCategories] = useState<ICategory[]>()
  const router=useRouter();
  const searchParams=useSearchParams();
  useEffect(()=>{
    const getCategories=async()=>{
      try{
      const categories=await axios.get('/api/category');
      if(categories.status==200)setCategories(categories.data.categories)
      }catch(e){handleError(e)}
    }
    getCategories();
  },[])
    let newurl=''
      
  const onSelectCategory=(category:string)=>{

    if(category&& category!='All'){
      newurl=formUrlQuery({
        params:searchParams.toString(),
        key:'category',
        value:category,
      })
    }
    else{
      newurl=removeKeysFromQuery({
        params:searchParams.toString(),
        keysToRemove:['category'],
      })


   } 
    router.push(newurl,{scroll:false})
  }
  return (
<Select onValueChange={(value:string)=>onSelectCategory(value)}>
  <SelectTrigger className="select-field">
    <SelectValue placeholder="Category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="All" className="select-item p-regular-14">All Categories</SelectItem>
    {categories?.map((e)=><SelectItem key={e.id} value={e.name} className="p-regular-14 select-item">{e.name}</SelectItem>)}
  </SelectContent>
</Select>
  )
}

export default CategoryFilter
