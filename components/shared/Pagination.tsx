"use client";
import { formUrlQuery } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const Pagination = ({urlParamName,page,totalPages}:{urlParamName?:string,page:number|string,totalPages:number}) => {
  const router=useRouter();
  const searchParams=useSearchParams();
  const onClick=(btnType:string)=>{
    const pageValue=btnType==='next'?Number(page)+1:Number(page)-1;
    const newUrl=formUrlQuery({
      params:searchParams.toString(),
      key: urlParamName||'page',
      value:pageValue.toString()
    }) 
    router.push(newUrl,{scroll:false})
  }
  return (
    <div className='flex gap-2'>
     <Button size={'lg'} variant={'outline'} className='w-28' onClick={()=>onClick('prev')} disabled={Number(page)<=1}>Previous</Button>
     <Button size={'lg'} variant={'outline'} className='w-28' onClick={()=>onClick('next')} disabled={Number(page)>=totalPages}>Next</Button>
    </div>
  )
}

export default Pagination
