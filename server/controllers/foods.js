var mongoose = require('mongoose');
var path = require("path");
var User = mongoose.model("User");
var Food = mongoose.model("Food");
var Order = mongoose.model("Order");

module.exports = { 
    create:function(req, res){
        var new_food = new Food({
            food_name: req.body.food_name,
            price: req.body.price,
            description:req.body.description,
            image: req.body.image
        })
        new_food.save(function(err){
            if(err){

            }else{
                res.json("good");
            }
        })
    },

    get_foods:function(req, res){
        Food.find({}, function(err, foods){
            if (err){
                console.log("err")
            }else{
                res.json(foods);
            }
        })
    },

    place_order: function(req, res) {
        var user_id = req.params.user_id;
        var food = req.body;
        console.log(req.body.length);
        User.findOne({_id: user_id}, function(err, user) {
            if(err) {
                console.log("err from place order: ", err);
            }
            else {
                var order = new Order();
                order.total_price = 0;
                order.order_user = user._id;
                order.quantity = "";
                for(var i = 0; i < food.length; i++) {
                    order.foods.push(food[i]);
                    order.total_price += (food[i].price * food[i].quantity);
                    order.quantity += (food[i].food_name + ": " + food[i].quantity + "; ")
                }

                order.save(function(err) {
                    if(err) {
                        console.log("err from save order: ", err);
                    }
                    else {
                        res.json("success submit order")
                    }
                })
            }
        })

    },

    retrieveOrder: function(req, res) {
        var user_id = req.params.id;
        Order.find({order_user: user_id}).sort({createdAt: "desc"}).populate("foods").exec(function(err, order) {
            if(err) {
                console.log("err from retrieve order: ", err);
            }
            else {
                res.json(order);
                console.log("retrieve all orders: ", order);
            }
        })
    }

}












