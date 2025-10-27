const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
});

const Color = mongoose.model('Color', colorSchema);

const saveColor = async (key, value) => {
    let color = await Color.findOne({ key });
    if (color) {
        color.set({ value });
    } else {
        color = new Color({ key, value });
    }
    await color.save();
}

const getColor = async (key) => {
    let color = await Color.findOne({ key });
    if (color) {
        return color.value || 'blue';
    } else {        
       return process.env.DEFAULT_COLOR || 'blue';
    }
};

const getColors = async () => {
    return await Color.find({});
};

module.exports = {
    saveColor,
    getColor,
    getColors,
};