const pandit = require('../models/pandit.model');
const Booking = require('../models/poojaBooks.model');

module.exports.getPanditStats = async (req, res) => {
  try {
    const result = await pandit.aggregate([
        { $match: { expertise: "Pandit" } },
       {
        $lookup: {
          from: "poojabooks",      // ⚡️ check collection name in DB
          localField: "_id",
          foreignField: "panditId",
          as: "bookings"
        }
      },
       {
        $addFields: {
          totalBookings: {
            $size: {
              $filter: {
                input: "$bookings",
                as: "b",
                cond: { $eq: ["$$b.status", "confirmed"] }
              }
            }
          }
        }
      },  { $sort: { totalBookings: -1 } },
       {
        $project: {
          _id: 0,
          panditId: "$_id",
          fullname: 1,
          email: 1,         // include other fields if you want
          mobile: 1,
          totalBookings: 1
        }
      }
     
    ]);

    // console.log("📊 Pandit Stats:", result);

    res.json(result);
  } catch (err) {
    console.error("❌ Error in getPanditStats:", err.message);
    res.status(500).json({ error: err.message });
  }
};
