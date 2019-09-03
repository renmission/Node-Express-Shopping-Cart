const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require('../models/Category');



// GET categorys
router.get('/', (req, res) => {
    Category.find((err, categories) => {
        if(err) return console.log(err);
        res.render('admin/categories', {categories});
    })
});

//GET add category
router.get('/add-category', (req, res) => {
    const title = "";
    const slug = "";

    res.render('admin/add-category', {
        title,
        slug
    });
});

// POST add category
router.post('/add-category', [
    check('title', 'Title should not be empty').not().isEmpty(),
], (req, res) => {

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });
        return res.render('admin/add-category', {
            title: title,
            slug: slug,
            errors: errors.array()
        });
    } else {
        Category.findOne({ slug: slug }, (err, cat) => {
            if (cat) {
                req.flash('danger', 'Category slug exist, try another one');
                return res.render('admin/add-category', {
                    title,
                    slug
                });
            } else {
                const cat = new Category({
                    title: title,
                    slug: slug
                });

                cat.save(err => {
                    if (err) return console.log(err);
                    req.flash('success', 'Category added');
                    res.redirect('/admin/categories');
                });

            }
        })
    }
});


//GET edit category
router.get('/edit-category/:slug', (req, res) => {
    Category.findOne({ slug: req.params.slug }, (err, cat) => {
        if (err) return console.log(err);

        res.render('admin/edit-category', {
            title: cat.title,
            slug: cat.slug,
            id: cat._id
        });
    });
});


// POST edit category
router.post('/edit-category', [
    check('title', 'Title should not be empty').not().isEmpty(),
], (req, res) => {

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let id = req.body.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });
        return res.render('admin/edit-category', {
            id,
            title,
            slug,
            errors: errors.array()
        });
    } else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, (err, cat) => {
            if (cat) {
                req.flash('danger', 'Category slug exist, try another one');
                return res.render('admin/edit-category', {
                    title,
                    slug,
                    id
                });
            } else {
                Category.findById(id, (err, cat) => {
                    if (err) return console.log(err);

                    cat.title = title;
                    cat.slug = slug;

                    cat.save(err => {
                        if (err) return console.log(err);
                        req.flash('success', 'Category Updated');
                        res.redirect('/admin/categories/edit-category/' + cat.slug);
                    });

                });



            }
        })
    }
});

router.get('/delete-category/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, cat) => {
        if (err) return console.log(err);

        req.flash('success', `Category deleted`);
        res.redirect(`/admin/categories`);
    })
});


module.exports = router;