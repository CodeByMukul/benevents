// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string
  event: {
    title: string
    description: string
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
  }
  path: string
}

export type UpdateEventParams = {
  userId: string
  event: {
    _id: string
    title: string
    imageUrl: string
    description: string
    location: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
  }
  path: string
}

export type DeleteEventParams = {
  eventId: string
  path: string
}

export type GetAllEventsParams = {
  query: string
  category: string
  limit: number
  page: number
}

export type GetEventsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedEventsByCategoryParams = {
  categoryId: string
  eventId: string
  limit?: number
  page: number | string
}

export type Event = {
  _id: string
  title: string
  description: string
  price: string
  isFree: boolean
  imageUrl: string
  location: string
  startDateTime: Date
  endDateTime: Date
  url: string
  organizer: {
    _id: string
    firstName: string
    lastName: string
  }
  category: {
    _id: string
    name: string
  }
}

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string
}

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string
  eventId: string
  price: string
  isFree: boolean
  buyerId: string
}

export type CreateOrderParams = {
  rzpId: string
  eventId: string
  buyerId: string
  totalAmount: string
  createdAt: Date
}

export type GetOrdersByEventParams = {
  eventId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params:Promise< { id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface IUser {
  userId: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  events?: IEvent[];  
  orders?: IOrder[]; 
  canCreateEvents: boolean;
  isAdmin: boolean;
}

export interface IOrder {
  id: number;
  createdAt: Date;
  rzpId: string;
  totalAmount?: string|null;
  eventId: string;
  event?: IEvent;  
  buyerId: string;
  buyer?: IUser;  
  status: string;
  used: boolean;
}

export interface IEvent{
    "eventId":string; 
    "organizer":string; 
    "title":string;
    "description":string|null|undefined;
    "location":string|null; 
    "createdAt": Date;
    "imageUrl": string;
    "startDateTime": Date;
    "endDateTime": Date;
    "price": string|null;
    "isFree": boolean;
    "url": string|null;
    "categoryId": string;
    "host"?:IUser ,
    registrationStart: Date,
    registrationEnd: Date,
    
    "category": {
        "id": string;
        "name": string;
}, "orders"?:IOrder[]
}

