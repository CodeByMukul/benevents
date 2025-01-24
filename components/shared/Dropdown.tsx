"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Input } from "../ui/input"
import { startTransition, useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios'

const Dropdown = ({value,onChangeHandler}:{value?:string, onChangeHandler?:()=>void}) => {
  interface ICategory{
   id:string;
    name: string;
  }
  const [categories, setCategories] = useState<ICategory[]>([{
    name:"test",id:"1"
  }])
  const [newCategory, setNewCategory] = useState("")
  const handleAddCategory=()=>{
   const newCat= axios.post(`/api/category`,{name:newCategory.trim()}).then((res)=>{console.log(res);
      setCategories((e)=>[...e,{name:newCategory,id:res.data.cat.id}])
    }).catch((e)=>{console.log(e);console.log("Error category creation")})   

  }
  useEffect(()=>{
    const getCategories=async()=>{
      const categories=await axios.get('/api/category');
      if(categories.status==200)setCategories(categories.data.categories)
    }
    getCategories();

  },[])
  return (
    <>
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 && categories.map((category) => (
          <SelectItem key={category.id} value={category.id} className="select-item p-regular-14">
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Add new category</AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input type="text" placeholder="Category name" className="input-field mt-3" onChange={(e) => setNewCategory(e.target.value)} />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => startTransition(handleAddCategory)}>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
</>
  )
}

export default Dropdown
