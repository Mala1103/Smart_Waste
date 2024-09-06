const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define Profile schema
const ProfileSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
});

// Create Profile model
const Profile = mongoose.model('Profile', ProfileSchema);

// POST route to save profile data
router.post('/profile', async (req, res) => {
    const { username, email, phone, addressLine1, postalCode, city, state, country } = req.body;

    try {
        const newProfile = new Profile({
            username,
            email,
            phone,
            addressLine1,
            postalCode,
            city,
            state,
            country
        });

        await newProfile.save();
        res.status(201).json({ success: true, message: 'Profile saved successfully' });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ success: false, message: 'Failed to save profile' });
    }
});

// GET route to fetch a profile by email
router.get('/profile/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.json({ success: true, profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});

// PUT route to update profile data
router.put('/profile/:email', async (req, res) => {
    const { email } = req.params;
    const { username, phone, addressLine1, postalCode, city, state, country } = req.body;

    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { email },
            { username, phone, addressLine1, postalCode, city, state, country },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

module.exports = router;
