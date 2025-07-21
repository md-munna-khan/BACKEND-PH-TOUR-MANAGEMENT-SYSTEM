



import { QueryBuilder } from "../../utils/QueryBuilder";
import {  tourSearchableFields } from "./tour.contant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    // const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}`

    // let counter = 0;
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}` // dhaka-division-2
    // }

    // payload.slug = slug;

    const tour = await Tour.create(payload)

    return tour;
};

// const getAllTours = async (query:Record<string,string>) => {
  
// const filter = query
// const searchTerm=query.searchTerm || "";
// const sort =query.sort || "-createdAt";
// const page=Number(query.page) || 1
// const limit=Number (query.limit) || 10
// const skip =(page -1) * Number(limit)
// // field filtering
// const fields =query.fields?.split(",").join(" ") || ""

// // delete filter["searchTerm"]
// // delete filter["sort"]



// for (const field of excludeField){
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field]
// }

// const searchQuery={
//     $or: tourSearchableFields.map(field => ( {[field]:{$regex: searchTerm,$options:"i" }}))}
    
// // const allTours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);

//    const filterQuery = Tour.find(filter)
//     const tours = filterQuery.find(searchQuery)
//     const allTours = await tours.sort(sort as string).select(fields).skip(skip).limit(limit);


//     const totalTours = await Tour.countDocuments();
// const totalPage=Math.ceil(totalTours/limit)
//     const meta = {
//         page:page,
//            limit:limit,
//         total:totalTours,
//         totalPage:totalPage
//     }
//     return {
//         data: allTours,
//         meta: meta
//     }
// };

//query builder 




const getAllTours = async (query: Record<string, string>) => {
    // const filter = query
    // const searchTerm = query.searchTerm || ""

    // const sort = query.sort || "-createdAt"

    // const page = Number(query.page) || 1
    // const limit = Number(query.limit) || 10

    // const skip = (page - 1) * limit

    // const fields = (query.fields as string)?.split(",").join(" ") || "";


    // for (const field of excludedFields) {
    //     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    //     delete filter[field]
    // }


    // const searchObject = {
    //     $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
    // }


    // const filterQuery = Tour.find(filter) //model Query
    // const tours = filterQuery.find(searchObject)
    // const allTours = await tours.sort(sort as string).select(fields).skip(skip).limit(limit); //document

    // all works will be don e by QueryBuilder
    const queryBuilder = new QueryBuilder(Tour.find(), query)

           const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()
       
    // model query is in last because it will resolve the code. before resolve we want to do search sort filter pagination 

    // const totalTours = await Tour.countDocuments();
    // const meta = {
    //     total: totalTours,
    //     totalPage: Math.ceil(totalTours / limit),
    //     page: page,
    //     limit: limit,
    // }
       // const meta = await queryBuilder.getMeta()
      const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]) //update for parallel fetching


    return {
        data,
        meta
    }
};



const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    // if (payload.title) {
    //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}`

    //     let counter = 0;
    //     while (await Tour.exists({ slug })) {
    //         slug = `${slug}-${counter++}`
    //     }

    //     payload.slug = slug
    // }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    return updatedTour;
};

const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {

    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create({ name: payload });
};

const getAllTourTypes = async () => {
    return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};

export const TourService = {
    createTour,
    createTourType,
    deleteTourType,
    updateTourType,
    getAllTourTypes,
    getAllTours,
    updateTour,
    deleteTour,
};