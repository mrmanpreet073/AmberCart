import { Address } from "../Models/userAddress.model.js";


export const getAddress = async (req, res) => {

    try {

        const userId = req.params.userId

        const address = await Address.find(
            {
                userId
            }
        )

        if (address.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Address Not Found"
            });
        }

        // console.log(address);

        return res.status(200).json({
            success: true,
            message: "Address Found Successfully",
            address
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const addAddress = async (req, res) => {

    try {
        const userId = req.params.userId
        const { fullName, phone, address, city, state, postalCode, country } = req.body

        const newAddress = await Address.create({
            userId,
            fullName,
            phone,
            address,
            city,
            state,
            postalCode,
            country
        });

        return res.status(201).json({
            success: true,
            message: "Address Added Successfully",
            address: newAddress
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const updateAddress = async (req, res) => {
    try {

        const { addressId } = req.params;
        const { fullName, phone, address, city, state, postalCode, country } = req.body

        const UpdateAddress = await Address.findById(addressId);

        if (!UpdateAddress) {
            return res.status(400).json({
                success: false,
                message: "Address Not Found"
            });
        }

        UpdateAddress.fullName = fullName || UpdateAddress.fullName
        UpdateAddress.phone = phone || UpdateAddress.phone
        UpdateAddress.address = address || UpdateAddress.address
        UpdateAddress.city = city || UpdateAddress.city
        UpdateAddress.state = state || UpdateAddress.state
        UpdateAddress.postalCode = postalCode || UpdateAddress.postalCode
        UpdateAddress.country = country || UpdateAddress.country

        const updatedAddress = await UpdateAddress.save()

        return res.status(200).json({
            success: true,
            message: "Address Updated Successfully",
            address: updatedAddress
        });



    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteAddress = async (req, res) => {

    try {
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

