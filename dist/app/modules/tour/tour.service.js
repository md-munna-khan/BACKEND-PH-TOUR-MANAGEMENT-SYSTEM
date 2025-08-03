"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_contant_1 = require("./tour.contant");
const tour_model_1 = require("./tour.model");
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findOne({ title: payload.title });
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
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
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
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield queryBuilder
        .search(tour_contant_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    // model query is in last because it will resolve the code. before resolve we want to do search sort filter pagination 
    // const totalTours = await Tour.countDocuments();
    // const meta = {
    //     total: totalTours,
    //     totalPage: Math.ceil(totalTours / limit),
    //     page: page,
    //     limit: limit,
    // }
    // const meta = await queryBuilder.getMeta()
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]); //update for parallel fetching
    return {
        data,
        meta
    };
});
// const updateTour = async (id: string, payload: Partial<ITour>) => {
//     const existingTour = await Tour.findById(id);
//     if (!existingTour) {
//         throw new Error("Tour not found.");
//     }
//     // if (payload.title) {
//     //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
//     //     let slug = `${baseSlug}`
//     //     let counter = 0;
//     //     while (await Tour.exists({ slug })) {
//     //         slug = `${slug}-${counter++}`
//     //     }
//     //     payload.slug = slug
//     // }
//   if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
//         payload.images = [...payload.images, ...existingTour.images]
//         // 📝 This is combining newly added images with existing ones,
//         // so we can later filter out deleted ones and finalize the image list.
//     }
//     // ✅ Now handle deleted images:
//     // deletedImages array will be coming from frontend on the go. i mean if any existing image that user deleted will be stored in deletedImages array in frontend and will be coming inside payload 
//     if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
//         // 🧹 Step 1: Filter out the images that were marked for deletion from the DB list
//         const restDBImages = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
//         // 📝 This gives us the images that still exist in the tour after deletion.
//         // this is storing the images that is not existing is delete array 
//         // there is a problem like user might delete images and add images at the same time. we have to grab the images that are newly added as well 
//         // ➕ Step 2: Identify new images added by user
//         const updatedPayloadImages = (payload.images || [])
//             // Remove any that are marked for deletion (just in case)
//             .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
//             // Exclude existing non-deleted DB images to avoid duplication
//             .filter(imageUrl => !restDBImages.includes(imageUrl))
//         // Step 3: Merge the remaining DB images with the new images
//         payload.images = [...restDBImages, ...updatedPayloadImages]
//     }
//     const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });
//   if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
//         await Promise.all(payload.deleteImages.map(url => deleteImageFromCloudinary(url)))
//     }
//     return updatedTour;
// };
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found.");
    }
    // ✅ If the user has uploaded new images AND there are existing images in the DB,
    // merge both sets together into payload.images.
    // This helps to temporarily keep both new and old images in the payload.
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
        // 📝 This is combining newly added images with existing ones,
        // so we can later filter out deleted ones and finalize the image list.
    }
    // ✅ Now handle deleted images:
    // deletedImages array will be coming from frontend on the go. i mean if any existing image that user deleted will be stored in deletedImages array in frontend and will be coming inside payload 
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        // 🧹 Step 1: Filter out the images that were marked for deletion from the DB list
        const restDBImages = existingTour.images.filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        // 📝 This gives us the images that still exist in the tour after deletion.
        // this is storing the images that is not existing is delete array 
        // there is a problem like user might delete images and add images at the same time. we have to grab the images that are newly added as well 
        // ➕ Step 2: Identify new images added by user
        const updatedPayloadImages = (payload.images || [])
            // Remove any that are marked for deletion (just in case)
            .filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            // Exclude existing non-deleted DB images to avoid duplication
            .filter(imageUrl => !restDBImages.includes(imageUrl));
        // Step 3: Merge the remaining DB images with the new images
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    // deletes from cloudinary
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true });
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tour_model_1.Tour.findByIdAndDelete(id);
});
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    return yield tour_model_1.TourType.create({ name: payload });
});
const getAllTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield tour_model_1.TourType.find();
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    return yield tour_model_1.TourType.findByIdAndDelete(id);
});
exports.TourService = {
    createTour,
    createTourType,
    deleteTourType,
    updateTourType,
    getAllTourTypes,
    getAllTours,
    updateTour,
    deleteTour,
};
