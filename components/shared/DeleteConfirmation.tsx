'use client'

import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Image from 'next/image'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import axios from 'axios'

const DeleteConfirmation = ({ eventId }: { eventId: string }) => {
  const {userId}=useAuth();
  const pathname = usePathname()
  let [isPending, startTransition] = useTransition()
  const deleteEvent=async()=>{
    try{
    const res=await axios.post('/api/event/delete',{eventId,userId})
    console.log(res)
    window.location.reload();}
    catch(e){
      console.log(e);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image src="/assets/icons/delete.svg" alt="edit" width={20} height={20} />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            This will permanently delete this event
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteEvent()
              })
            }>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default DeleteConfirmation
