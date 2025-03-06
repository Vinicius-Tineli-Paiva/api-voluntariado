const Activity = require("../models/activity.js");

async function create(req, res) {
    const { title, description, date, location, maxParticipants } = req.body;
    const activity = await Activity.create(title, description, date, location, maxParticipants);
    res.status(201).json(activity);
}

async function getAll(req, res) {
    const activities = await Activity.getAll();
    res.json(activities);
}

module.exports = { create, getAll };