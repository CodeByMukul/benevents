import Card from "./Card";
import { auth } from "@clerk/nextjs/server";
import { IEvent } from "@/types";
import Pagination from "./Pagination";
type CollectionProps={
  data:IEvent[],
  emptyTitle:string,
  emptyStateSubtext:string,
  limit:number,
  page:number|string,
  totalPages?:number,
  urlParamName?:string,
  collectionType?:'Events_Organized'|'My_Tickets'|'All_Events'

}

const Collection = async({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages=0,
  collectionType,
  urlParamName,
}:CollectionProps) => {
// In your parent component
const { sessionClaims } = await auth();
const userId = sessionClaims?.sub;
const username = sessionClaims?.username;

  return (
    <>
    {data.length>0?<div className="flex flex-col items-center gap-10">
      <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        {data.map((event)=>{
          const hasOrderLink=collectionType==='Events_Organized';
          const hidePrice=collectionType==='My_Tickets';
          return(
            <li key={event.eventId} className="flex justify-center">
              <Card event={event} hasOrderLink={hasOrderLink} hidePrice={hidePrice}></Card>
            </li>
          )
        })} 
      </ul>
      {
        totalPages>1&&(
          <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages}/>
        )
      }
      </div>:
    <div className="flex-center wrapper min-h-[200px] w-full flex-col rounded-[14px] bg-grey-50 py-28 text-center">
      <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
      <p className="p-regular-14 ">{emptyStateSubtext}</p>
    </div>
    }
    </>
  )
}

export default Collection
