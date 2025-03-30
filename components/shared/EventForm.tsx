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
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import Dropdown from "./Dropdown";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IEvent } from "@/types";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { handleError } from "@/lib/utils";

  interface ICategory{
   id:string;
    name: string;
  }
// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
};

const EventForm = ({clerkId,type,event}:{clerkId:string,type:"Create"|"Update",event?:IEvent}) => {
  useEffect(()=>{
    try{
    const getCategories=async()=>{
      const categories=await axios.get('/api/category');
      if(categories.status==200)setCategories(categories.data.categories)
    }
    getCategories();
    }catch(e){
      handleError(e)
    }

  },[])
  const [cats, setCategories] = useState<ICategory[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [activeTab, setActiveTab] = useState("basic");
  const [teamRegistration, setTeamRegistration] = useState(false);
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([{question: "", answer: ""}]);
  const [rewards, setRewards] = useState<{title: string, description: string}[]>([{title: "", description: ""}]);
  
  const initialValues=event&&type==="Update"?event:eventDefaultValues;
  const form = useForm<IEvent>({
    resolver: zodResolver(eventFormSchema),
    defaultValues:initialValues , })
  const router=useRouter();
 
  const {startUpload} = useUploadThing('imageUploader')
  
  // Add FAQ
  const addFaq = () => {
    setFaqs([...faqs, {question: "", answer: ""}]);
  };

  // Remove FAQ
  const removeFaq = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
  };

  // Update FAQ
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  // Add Reward
  const addReward = () => {
    setRewards([...rewards, {title: "", description: ""}]);
  };

  // Remove Reward
  const removeReward = (index: number) => {
    const newRewards = [...rewards];
    newRewards.splice(index, 1);
    setRewards(newRewards);
  };

  // Update Reward
  const updateReward = (index: number, field: 'title' | 'description', value: string) => {
    const newRewards = [...rewards];
    newRewards[index][field] = value;
    setRewards(newRewards);
  };

  async function onSubmit(values: IEvent) {
    let uploadedImageUrl=values.imageUrl;
    if(files.length>0){
      const uploadedImages=await startUpload(files);
      if(!uploadedImages)return;
      uploadedImageUrl=uploadedImages[0].url;
    }
    
    // Add the additional fields to the form data
    const enhancedValues = {
      ...values,
      teamRegistration,
      faqs,
      rewards
    };
    
    if(type==='Create'){
      try{
        const newEvent=await axios.post('/api/event',{...enhancedValues,imageUrl:uploadedImageUrl,id:clerkId})
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
        const newEvent=await axios.put('/api/event',{...enhancedValues,imageUrl:uploadedImageUrl,clerkId,eventId:event?.eventId})
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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full"
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="basic" onClick={() => setActiveTab("basic")}>Basic Info</TabsTrigger>
          <TabsTrigger value="details" onClick={() => setActiveTab("details")}>Details</TabsTrigger>
          <TabsTrigger value="additional" onClick={() => setActiveTab("additional")}>Additional Info</TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setActiveTab("preview")}>Preview</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            
            <TabsContent value="basic">
              <motion.div variants={slideIn} className="space-y-6">
                <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Title</FormLabel>
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
                        <FormLabel>Category</FormLabel>
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
                        <FormLabel>Description</FormLabel>
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
                        <FormLabel>Event Image</FormLabel>
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
              </motion.div>
            </TabsContent>

            <TabsContent value="details">
              <motion.div variants={slideIn} className="space-y-6">
                <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Location</FormLabel>
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
                        <FormLabel>Event Start Date & Time</FormLabel>
                        <FormControl>
                          <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                            <Image alt="" src="/assets/icons/calendar.svg" className="filter-grey" width={24} height={24} />
                            <DatePicker selected={field.value} onChange={(date:Date|null) => field.onChange(date)} timeInputLabel="Time: " showTimeSelect dateFormat='MM/dd/yyyy h:mm aa' wrapperClassName="datePicker" />
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
                        <FormLabel>Event End Date & Time</FormLabel>
                        <FormControl>
                          <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                            <Image alt="" src="/assets/icons/calendar.svg" className="filter-grey" width={24} height={24} />
                            <DatePicker selected={field.value} onChange={(date:Date|null) => field.onChange(date)} timeInputLabel="Time: " showTimeSelect dateFormat='MM/dd/yyyy h:mm aa' wrapperClassName="datePicker" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Registration Dates */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium">Registration Period</h4>
                    <Checkbox 
                      id="sameAsEvent" 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          form.setValue('registrationStart', form.watch('startDateTime'));
                          form.setValue('registrationEnd', form.watch('endDateTime'));
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <label htmlFor="sameAsEvent" className="text-sm text-gray-600">Same as event dates</label>
                  </div>
                  
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="registrationStart"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Registration Start</FormLabel>
                          <FormControl>
                            <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                              <Image alt="" src="/assets/icons/calendar.svg" className="filter-grey" width={24} height={24} />
                              <DatePicker selected={field.value} onChange={(date:Date|null) => field.onChange(date)} timeInputLabel="Time: " showTimeSelect dateFormat='MM/dd/yyyy h:mm aa' wrapperClassName="datePicker" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationEnd"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Registration End</FormLabel>
                          <FormControl>
                            <div className="flex-center h-[54px] overflow-hidden rounded-full bg-grey-50 px-4 py-2 w-full">
                              <Image alt="" src="/assets/icons/calendar.svg" className="filter-grey" width={24} height={24} />
                              <DatePicker selected={field.value} onChange={(date:Date|null) => field.onChange(date)} timeInputLabel="Time: " showTimeSelect dateFormat='MM/dd/yyyy h:mm aa' wrapperClassName="datePicker" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Updated FAQs Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addFaq}
                      className="hover:bg-primary-50"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add FAQ
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <Input 
                              placeholder="Question" 
                              value={faq.question} 
                              onChange={(e) => updateFaq(index, 'question', e.target.value)}
                              className="font-medium bg-transparent border-transparent hover:border-gray-200 focus:border-primary-500"
                            />
                            <Textarea 
                              placeholder="Answer" 
                              value={faq.answer} 
                              onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                              className="min-h-[100px] bg-white"
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFaq(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Updated Rewards Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Rewards & Prizes</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addReward}
                      className="hover:bg-primary-50"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Reward
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {rewards.map((reward, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Prize #{index + 1}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeReward(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input 
                            placeholder="Reward Title" 
                            value={reward.title} 
                            onChange={(e) => updateReward(index, 'title', e.target.value)}
                            className="font-medium bg-transparent border-transparent hover:border-gray-200 focus:border-primary-500"
                          />
                          <Textarea 
                            placeholder="Reward Description" 
                            value={reward.description} 
                            onChange={(e) => updateReward(index, 'description', e.target.value)}
                            className="min-h-[100px] bg-white"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Add Additional Info Tab Content */}
            <TabsContent value="additional">
              <motion.div variants={slideIn} className="space-y-6">
                {/* Team Registration Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-lg font-semibold">Team Registration</h3>
                    <Checkbox 
                      checked={teamRegistration}
                      onCheckedChange={(checked: boolean) => setTeamRegistration(checked)}
                      className="h-4 w-4"
                    />
                    <label className="text-sm text-gray-600">Enable team registration</label>
                  </div>

                  {teamRegistration && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Min Team Size</FormLabel>
                          <Input type="number" min={1} placeholder="Minimum team members" className="input-field" />
                        </div>
                        <div>
                          <FormLabel>Max Team Size</FormLabel>
                          <Input type="number" min={1} placeholder="Maximum team members" className="input-field" />
                        </div>
                      </div>
                      <div>
                        <FormLabel>Team Registration Instructions</FormLabel>
                        <Textarea placeholder="Instructions for team registration" className="textarea rounded-2xl" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* FAQs Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addFaq}
                      className="hover:bg-primary-50"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add FAQ
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <Input 
                              placeholder="Question" 
                              value={faq.question} 
                              onChange={(e) => updateFaq(index, 'question', e.target.value)}
                              className="font-medium bg-transparent border-transparent hover:border-gray-200 focus:border-primary-500"
                            />
                            <Textarea 
                              placeholder="Answer" 
                              value={faq.answer} 
                              onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                              className="min-h-[100px] bg-white"
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFaq(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Rewards & Prizes</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addReward}
                      className="hover:bg-primary-50"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Reward
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {rewards.map((reward, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Prize #{index + 1}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeReward(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input 
                            placeholder="Reward Title" 
                            value={reward.title} 
                            onChange={(e) => updateReward(index, 'title', e.target.value)}
                            className="font-medium bg-transparent border-transparent hover:border-gray-200 focus:border-primary-500"
                          />
                          <Textarea 
                            placeholder="Reward Description" 
                            value={reward.description} 
                            onChange={(e) => updateReward(index, 'description', e.target.value)}
                            className="min-h-[100px] bg-white"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="preview">
              <motion.div variants={slideIn} className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-6">Event Card Preview</h3>
                <div className="w-full max-w-[400px]">
                  <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
                    <div 
                      style={{backgroundImage: form.watch('imageUrl') ? `url(${form.watch('imageUrl')})` : 'none'}}
                      className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500"
                    >
                      {!form.watch('imageUrl') && (
                        <p className="text-gray-500">No image</p>
                      )}
                    </div>
                    
                    <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
                      <div className="flex gap-2">
                        <span className="p-semibold-14 w-min line-clamp-1 rounded-full bg-green-100 px-4 py-1 text-green-600">
                          {form.watch('isFree') ? 'FREE' : form.watch('price') ? `₹${form.watch('price')}` : 'Price not set'}
                        </span>
                        <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-grey-500 line-clamp-1">
                          {cats.filter(cat => cat.id===form.watch('categoryId'))[0]?.name }
                        </p>
                      </div>
                      
                      <p className="p-medium-16 p-medium-18 text-grey-500">
                        {form.watch('startDateTime') 
                          ? new Date(form.watch('startDateTime')).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : 'Date not set'}
                      </p>
                      
                      <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
                        {form.watch('title') || 'Event Title'}
                      </p>
                      
                      <div className="w-full md:flex-between">
                        <p className="p-medium-16 md:p-medium-18 text-slate-500">
                          Hosted By:
                        </p>
                        <div className="flex items-center gap-1 p-medium-14 md:p-medium-16 text-gray-600">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">You</span>
                          </div>
                          <span>You</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <motion.div 
              variants={fadeIn}
              className="mt-8"
            >
              <Button 
                type="submit" 
                size="lg" 
                disabled={form.formState.isSubmitting} 
                className="button col-span-2 w-full"
              >
                {form.formState.isSubmitting ? "Submitting" : `${type} Event`}
              </Button>
            </motion.div>
          </form>
        </Form>
      </Tabs>
    </motion.div>
  )
}

export default EventForm
