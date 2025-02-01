"use client";
import { useUser } from "@clerk/nextjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useState } from "react";
import {uploadFiles, useUploadThing} from '@/lib/uploadthing'
import FileUploader from "./FileUploader";
import { Textarea } from "../ui/textarea";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import Dropdown from "./Dropdown";
import { Checkbox } from "../ui/checkbox";
import prisma from "@/lib/prisma";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IEvent } from "@/types";
const EventForm = ({clerkId,type,event}:{clerkId:string,type:"Create"|"Update",event?:IEvent}) => {
  const { isSignedIn, user, isLoaded } = useUser()
  const [files, setFiles] = useState<File[]>([])
  const initialValues=event&&type==="Update"?event:eventDefaultValues;
  const form = useForm<IEvent>({
    resolver: zodResolver(eventFormSchema),
    defaultValues:initialValues , })
  const router=useRouter();
 
    const {startUpload} = useUploadThing('imageUploader')
  async function onSubmit(values: IEvent) {
    let uploadedImageUrl=values.imageUrl;
    if(files.length>0){
      const uploadedImages=await startUpload(files);
      if(!uploadedImages)return;
      uploadedImageUrl=uploadedImages[0].url;
    }
    if(type==='Create'){
      try{
        const newEvent=await axios.post('/api/event',{...values,imageUrl:uploadedImageUrl,id:user?.id})
        if(newEvent.status=200){
          form.reset();
          router.push(`/events/${newEvent.data.eventId}`)
        }
      }catch(e){
        console.log(e);
      }
    }
    if(type==="Update"){
      if(!event?.eventId)router.back();
      try{
        const newEvent=await axios.put('/api/event',{...values,imageUrl:uploadedImageUrl,id:event?.host.clerkId,eventId:event?.eventId})
        if(newEvent.status=200){
          form.reset();
          router.push(`/events/${newEvent.data.eventId}`)
        }
      }catch(e){
        console.log(e);
      }
    }
  }

  return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Event title" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown onChangeHandler={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <Textarea placeholder="Description" {...field} value={field.value??""} className="textarea rounded-2xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <FileUploader 
                      onFieldChange={field.onChange}
                      imageUrl={field.value!}
                      setFiles={setFiles}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                    <Image alt="" src="/assets/icons/location-grey.svg" width={24} height={24}></Image>
                    <Input placeholder="Event location or Online" {...field} value={field.value??""} className="input-field" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">

          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                    <Image alt="" src="/assets/icons/calendar.svg" className="filter-grey" width={24} height={24}></Image>
                    <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>
                    <DatePicker selected={field.value} onChange={(date:Date|null) => field.onChange(date)} timeInputLabel="Time: " showTimeSelect dateFormat='MM/dd/yyyy h:mm aa' wrapperClassName="datePicker"/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                    <Image alt="" src="/assets/icons/calendar.svg" className="filter-grey" width={24} height={24}></Image>
                    <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
                    <DatePicker selected={field.value} onChange={(date:Date|null) => field.onChange(date)} timeInputLabel="Time: " showTimeSelect dateFormat='MM/dd/yyyy h:mm aa' wrapperClassName="datePicker"/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                    <Image alt="" src="/assets/icons/rupee.svg" className="filter-grey" width={24} height={24}></Image>
                    <Input type="number" placeholder="Price" min={0} {...field} value={field.value??""} className=" p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"></Input>
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem >
                <FormControl>
                  <div className="flex items-center">
                    <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free Ticket</label>
                    <Checkbox id="isFree" onCheckedChange={field.onChange} checked={field.value} className="mr-2 h-5 w-5 border-2 border-primary-500"></Checkbox>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                    <Image src="/assets/icons/link.svg" alt="url" width={24}height={24}></Image>
                    <Input placeholder="URL" className="input-field" {...field} value={field.value??""}></Input>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="button col-span-2 w-full">{form.formState.isSubmitting?"Submitting":`${type} Event`}</Button>
      </form>
    </Form>  )
}

export default EventForm
