const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Page = require('../models/Page');



// GET add page
router.get('/', (req, res) => {
    Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
        res.render('admin/pages', { pages: pages })
    });
});

router.get('/add-page', (req, res) => {
    const title = "";
    const slug = "";
    const content = "";

    res.render('admin/add-page', {
        title,
        slug,
        content
    });
});

// POST add page
router.post('/add-page', [
    check('title', 'Title should not be empty').not().isEmpty(),
    // check('slug', 'Slug should not be empty').not().isEmpty(),
    check('content', 'Content should not be empty').not().isEmpty()
], (req, res) => {

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });
        return res.render('admin/add-page', {
            title: title,
            slug: slug,
            content: content,
            errors: errors.array()
        });
    } else {
        Page.findOne({ slug: slug }, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exist, try another one');
                return res.render('admin/add-page', {
                    title: title,
                    slug: slug,
                    content: content,
                    errors: errors.array()
                });
            } else {
                const page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sortig: 100
                });

                page.save(err => {
                    if (err) return console.log(err);
                    req.flash('success', 'Page added');
                    res.redirect('/admin/pages');
                });

            }
        })
    }



});


module.exports = router;