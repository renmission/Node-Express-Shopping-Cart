const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    }
});

module.exports = Page = mongoose.model('Page', PageSchema);