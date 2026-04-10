const panditModel = require('../models/pandit.model');

module.exports.createPandit = async ({
    fullname, email,experience, age, password, image, address, qualification
})=>{
    if(!fullname || !email || !experience || !age || !password || !image || !address || !qualification){
        throw new Error('All fields are required');
    }

    const pandit=panditModel.create({
        fullname,
        email,
        experience,
        age,
        password,
        image,
        address,
        qualification
    });

    return pandit;
}