"use client"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import { Input } from "../ui/input"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
const Search = ({placeholder='Search title...'}:{placeholder:string}) => {
  const [query, setQuery] = useState("")
  const router=useRouter();
  const searchParams=useSearchParams();
  useEffect(()=>{
    let newurl=''
    const deb=setTimeout(()=>{
      
    if(query){
      newurl=formUrlQuery({
        params:searchParams.toString(),
        key:'query',
        value:query,
      })
    }
    else{
      newurl=removeKeysFromQuery({
        params:searchParams.toString(),
        keysToRemove:['query'],
      })


   } 
    router.push(newurl,{scroll:false})
    },150);
    return ()=>clearTimeout(deb);
  },[query,searchParams,router])
  return (
    <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
      <Image src={"/assets/icons/search.svg"} alt="search" width={24} height={24}></Image>
      <Input type="text" placeholder={placeholder} onChange={(e)=>setQuery(e.target.value)} className="p-regular-16 order-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"></Input>
    </div>
  )
}

export default Search
