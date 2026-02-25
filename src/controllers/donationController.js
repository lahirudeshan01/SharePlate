const Donation = require("../models/Donation");

//Create a new donation
exports.createDonation = async (req,res) =>{
    try{
        const{ foodName,quantity,donorId,expiryDate,location,status} = req.body;

        const donation = await Donation.create({
            foodName,
            quantity,
            donor: donorId,
            expiryDate,
            location,
            status
        });

        res.status(201).json(donation);

    }catch(error){
res.status(400).json({message: error.message});
    }
};

// Get available donations
exports.getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "available" });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};