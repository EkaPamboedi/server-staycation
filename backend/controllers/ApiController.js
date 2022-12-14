const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
module.exports = {
    landingPage : async (req, res) =>{
    try{
        // const message = 'Hello Json';
        const mostPicked = await Item.find()
                            .select('_id title country price unit imageId')
                            .populate({ 
                                path: 'imageId', 
                                select: '_id imageUrl'})
                            .limit(5);
        
        const category = await Category.find()
                            .select('_id name')
                            .populate({ 
                                path: 'itemId', 
                                select: '_id title country isPopular unit imageId',
                                proDocumentLimit : 4,
                                option:{sort : { sumbooking : -1 }}, /* ngurutin secara descending*/
                                    populate:{ 
                                        path: 'imageId', 
                                        select: '_id imageUrl',
                                        proDocumentLimit : 1
                                    }
                            })
                            .limit(3);

        const treveler = await Traveler.find();
        const treasure = await Treasure.find();
        const city = await Item.find();
        // console.log(mostPicked);
        for(let i = 0; i < category.length; i++){
            for(let x = 0; x < category[i].itemId.length; x++){
                const item = await  Item.findOne({ _id:category[i].itemId[x]._id});
                item.isPopular = false;
                await item.save();
                if(category[i].itemId[0] === category[i].itemId[x]){
                    item.isPopular = true;
                    await item.save();
                }
            }
        };
        const testimonial = {
            _id :"asd129uasdads1",
            imageUrl : "/images/testimonial-landingpages.jpg",
            name : "Happy Familly",
            rate : 4.55,
            content : "What a gret loremipsum...",
            famillyName : "Budi",
            famillyOccuption : "Product Designer"
        };
        res.status(200).json({
            hero:{
                trevelers: treveler.length,
                treasures: treasure.length,
                cities : city.length
            },
            mostPicked,
            category,
            testimonial
        });
       }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error!"});
       }
    },

    detailPage: async(req, res)=>{
        try{
            const {id} = req.params;
            const item  = await Item.findOne({_id: id})
                            .populate({ 
                                path: 'featureId', 
                                select: '_id name qty imageUrl'})
                            .populate({ 
                                path: 'activityId', 
                                select: '_id name type imageUrl'})
                            .populate({ 
                                path: 'imageId', 
                                select: '_id imageUrl'});
            const bank = await Bank.find();
            const testimonial = {
                _id :"asd129uasdads1",
                imageUrl : "/images/testimonial-landingpages.jpg",
                name : "Happy Familly",
                rate : 4.55,
                content : "What a gret loremipsum...",
                famillyName : "Budi",
                famillyOccuption : "Product Designer"
            };
            
            res.status(200).json({
                // item,.
                ...item._doc,/*apaan ini? */
                bank,
                testimonial
            });
        }catch(error){
            console.log(error);
            res.status(500).json({ message:"Internal server error!" });
        }
    },
    bookingPage : async(req,res)=>{
        const {
            idItem,
            duration,
            // price,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom
        } = req.body;
        console.log(req.body);

        if(!req.file){
            return res.status(404).json({ message:"image not found!"})
        };
        if( 
            idItem === undefined ||
            duration === undefined ||
            // price === undefined ||
            bookingStartDate === undefined ||
            bookingEndDate === undefined ||
            firstName === undefined ||
            lastName === undefined ||
            email === undefined ||
            phoneNumber === undefined ||
            accountHolder === undefined ||
            bankFrom === undefined ){
                return res.status(404).json({message:"Lengkapi Semua Field!"});
        };
        const item = await Item.findOne({ _id: idItem});

        if(!item){
            return res.status(404).json({message:"Item not found!"});
        }

        item.sumBooking += 1;
        await item.save();

        let total = item.price * duration;
        let tax = total * 0.10;
        const invoice = Math.floor(1000000 + Math.random()*9000000);

        const member = await Member.create({
            firstName,
            lastName,
            email,
            phoneNumber
        });

        const newBooking = {
            invoice,
            bookingStartDate,
            bookingEndDate,
            total: total += tax,
            itemId:{
                _id: item.id,
                title: item.title,
                price: item.price,
                duration: duration,
            },
            memberId : member.id,
            payments:{
                proofPayment : `images/${req.file.filename}`,
                bankFrom: bankFrom,
                accountHolder: accountHolder,
            }
        }

        const booking = await Booking.create(newBooking);

        // console.log(total);
        // console.log(tax);
        // console.log(invoice);
        res.status(201).json({message:"Berhasil Booking!", booking});


    }
}