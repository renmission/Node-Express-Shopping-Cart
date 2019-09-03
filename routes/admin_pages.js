const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Page = require('../models/Page');



// GET pages
router.get('/', (req, res) => {
    Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
        res.render('admin/pages', { pages: pages })
    });
});

//GET add page
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
                    title,
                    slug,
                    content,
                });
            } else {
                const page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
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

// POST reorder pages
router.post('/reorder-pages', (req, res) => {
    var ids = req.body['id[]'];

    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;
        (function(count) {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save(err => {
                    if (err) return console.log(err);
                });
            });
        })(count);
    }
});


//GET edit page
router.get('/edit-page/:slug', (req, res) => {
    Page.findOne({ slug: req.params.slug }, (err, page) => {
        if (err) return console.log(err);

        res.render('admin/edit-page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });
});


// POST edit page
router.post('/edit-page', [
    check('title', 'Title should not be empty').not().isEmpty(),
    // check('slug', 'Slug should not be empty').not().isEmpty(),
    check('content', 'Content should not be empty').not().isEmpty()
], (req, res) => {

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;
    let id = req.body.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });
        return res.render('admin/edit-page', {
            id,
            title,
            slug,
            content,
            errors: errors.array()
        });
    } else {
        Page.findOne({ slug: slug, _id: { '$ne': id } }, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exist, try another one');
                return res.render('admin/edit-page', {
                    title,
                    slug,
                    content,
                    id
                });
            } else {
                Page.findById(id, (err, page) => {
                    if (err) return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content;

                    page.save(err => {
                        if (err) return console.log(err);
                        req.flash('success', 'Page Updated');
                        res.redirect('/admin/pages/edit-page/' + page.slug);
                    });

                });



            }
        })
    }
});

router.get('/delete-page/:id', (req, res) => {
    Page.findByIdAndRemove(req.params.id, (err, page) => {
        if (err) return console.log(err);

        req.flash('success', `Page deleted`);
        res.redirect(`/admin/pages`);
    })
});


module.exports = router;