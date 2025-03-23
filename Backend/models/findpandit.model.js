// const mongoose=require("mongoose");

// const findPanditSchema=new mongoose.Schema({
//     bookingId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"poojaBook",
//         required:true,
//     },
//     userLocation:{
//         type:{type:String,
//             enum:['Point'],
//             default:'Point'
//         },
//         coordinates:{
//             type:[Number],
//             required:true,
//         }
//     },
//     foundPandits:[{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'pandit'
//     }],
    

// });

// // Create a geospatial index
// findPanditSchema.index({ userLocation: '2dsphere' });

// const FindPandit = mongoose.model('FindPandit', findPanditSchema);
// module.exports = FindPandit; 