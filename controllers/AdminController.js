const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');
const { cache } = require('ejs');
const { create } = require('../models/Category');
const { title } = require('process');
const { about_app } = require('moongose/models');
//note semua module sudah terexport jadi cukup melakukan sekali export saja(?)

module.exports = {
    //Dashboard
    viewDashboard : (req, res)=>{
        res.render('admin/dashboard/view_dashboard',{
            title: "Staycation | Dashboard"
        });
    },
    //Category
    viewCategory : async(req, res)=> {
        try{
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status:alertStatus};
            // console.log(category);
         res.render('admin/category/view_category', {
            category, 
            alert,
            title :"Staycation | Category"
        });
        }catch(error){
            res.redirect('/admin/category');            
        }

    },
    addCategory: async (req, res) => {
        try{
            const {name} = req.body;
            // console.log(name);
            await Category.create({ name });
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');            
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');            
        }
    },
    editCategory: async(req, res)=>{
        try{
            const{id, name}= req.body;
            const category = await Category.findOne({_id: id}
                // , function (doc){
                // console.log(doc);
            // }
            );
            // console.log(category);
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');

        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');   
        }
    },
    deleteCategory: async(req, res)=>{
        try{
            const{ id }= req.params;
            const category = await Category.findOne({_id: id});
            await category.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');   
        }
    },
    //Bank
    viewBank : async(req, res)=>{
        try{
            // const{id, name} = req.body;
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status:alertStatus};
            res.render('admin/bank/view_bank', {
                bank,
                alert,
                title :"Staycation | Bank",
            });
        }catch(error){
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/bank');     
        }
    },
    addBank: async (req, res) => {
        try {
            const { name, bankName, bankNumber } = req.body;
            // console.log(req.file);
            await Bank.create({ 
                name, 
                bankName, 
                bankNumber,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    }, 
    editBank: async(req, res)=>{
        try{
            const{ id, name, bankName, bankNumber } = req.body;
            const bank = await Bank.findOne({ _id: id }
                // , function(doc){
                    // console.log(doc);
                    // }
                    );
            // let result = await User.findById(req.params.id);
            if(req.file == undefined){
                bank.name = name;
                bank.bankName = bankName;
                bank.bankNumber = bankNumber;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }else{
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.name = name;
                bank.bankName = bankName;
                bank.bankNumber = bankNumber;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');   
        }
    },

    deleteBank :async (req, res)=>{
        try{
            const{ id }= req.params;
            const bank = await Bank.findOne({_id: id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');   
        }
    },
    // get addBank() {
    //     return this._addBank;
    // },
    // set addBank(value) {
    //     this._addBank = value;
    // },
    
    viewItem :async (req, res) => {
        try{
            const item = await Item.find().push
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status:alertStatus};
            res.render('admin/item/view_item', {
                title :"Staycation | Item",
                category,
                alert
            });
            // console.log(category);
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item/');      
        }
    },
    addItem :async(req,res) => {
        try{
            // ini buat nerima data dari form
            const{categoryId, title, price, city, about} = req.body;
            

            if(req.files.length > 0 ){
                const category = await Category.findOne({ _id: categoryId}
                    // , function (doc){
                    //     console.log(doc);
                    // }
                    );
                const newItem = {
                    categoryId : category._id,
                    title,
                    description:about,
                    price,
                    city
                }
                const item = await Item.create(newItem);
                category.itemId.push({_id: item._id});
                await category.save();
                for(let i = 0; i < req.files.length; i++){
                    const imageSave = await Image.create({imageUrl: `images/${req.files[i].filename}` });
                    item.imageId.push({ _id: imageSave._id });
                    await item.save();
                }
                req.flash('alertMessage', 'Success Add Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item')   
            } 
        }catch(error){
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item/');      
        }

    },
    //Booking
    viewBooking :(req, res)=>{
        res.render('admin/booking/view_booking');
    }
}