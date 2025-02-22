import { type ClassValue, clsx } from 'clsx';

import { twMerge } from 'tailwind-merge'
import qs from 'query-string'
import { UrlQueryParams, RemoveUrlQueryParams } from '@/types'

import CryptoJS from "crypto-js";

const secretKey =process.env.SECRET_KEY_ENCRYPTION||"ajao bhai event me "; 

export function decryptJson(data: string): {eventId:string,orderId:string} {
  try{
  const decrypted = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
  const jsonData = JSON.parse(decrypted);
    
    return jsonData;}
    catch(e){return {eventId:"Invalid",orderId:""}}
}
export  function encryptJson(data: object): string {
  const jsonString = JSON.stringify(data); // Convert JSON to a string
  const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
  return encrypted;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDateTime = (dateString: Date) => {
  const date = new Date(dateString);

  const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return {
    dateTime: dateTimeFormatter.format(date), // Full date-time in IST
    dateOnly: dateFormatter.format(date), // Only date in IST
    timeOnly: timeFormatter.format(date), // Only time in IST
  };
};
export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)

  return formattedPrice
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export const handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}
