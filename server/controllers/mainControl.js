var mongoose = require('mongoose');
var path = require("path");
var User = mongoose.model("User");
var scrypt = require("scrypt");
var scryptParameters = scrypt.paramsSync(0.1);


module.exports = { 
  register: function (req, res) {
    User.find({}, function (err, users) {
      if (err) {
        console.error()("from controller register findall: ", err);
      }
      else {
        if (users.length == 0) {
          var unhash_password = scrypt.kdfSync(req.body.password, scryptParameters).toString('Base64');
          console.log("hasded password: ", unhash_password);
          var admin = new User({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: unhash_password
          });
          admin.user_level = 9;
          admin.save(function (err) {
            if (err) {
              console.error("from register controller: save normal user error");
            }
            else {
              res.json({ success: "success", user: admin });
            }
          })
        }
        else {
          User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
              console.error("from register controller: register normal user error");
            }
            else {
              if (user == null) {
                var unhash_pass = scrypt.kdfSync(req.body.password, scryptParameters).toString('Base64');

                var normal_user = new User({
                  email: req.body.email,
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  password: unhash_pass
                });
                normal_user.user_level = 0;
                normal_user.save(function (err) {
                  if (err) {
                    console.error("from register controller: save normal user error: ", err);
                  }
                  else {
                    res.json({ success: "success", user: normal_user });
                  }
                })
              }
              else {
                res.json("from register controller res: email existed")
              }
            }
          })
        }
      }
    })
  },

  login: function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        console.log("error from login controller: ", err);
      }
      else {
        if (user == null) {
          res.json({ error: "email invalid" })
        }
        else {
          var unhash_password = scrypt.verifyKdfSync(new Buffer(user.password, 'Base64'), req.body.password);
          console.log("unhash_password: ", unhash_password);
          if (unhash_password == true) {
            res.json(user)
          }
          else {
            res.json({ error: "password is not correct" })
          }
        }
      }
    })
  },

  check_user: function(req, res) {
    // console.log(req.body);
    if(req.body.email == null) {
      res.json("require email");
      
    }
    else {
      User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
          console.log("err from check user: ", err);
        }
        else {
          console.log("from check user: ", user);
          if(user == null) {
            res.json("update require");
          }
          else {
            res.json({user:user});
          }
        }
      })
    }
    
  },

  social_update: function(req, res) {
    console.log(req.body);
    var unhash_pass = scrypt.kdfSync(req.body.reg.password, scryptParameters).toString('Base64');
    if(req.body.user.email == null) {
      var user = new User({
        email: req.body.reg.email,
        first_name: req.body.user.firstName,
        last_name: req.body.user.lastName,
        password: unhash_pass,
        user_level: 0
        })
      user.save(function(err) {
        if(err) {
          console.log("err from social update: ", err);
        }
        else {
          res.json(user)
        }
      })
    }
    else {
      var user = new User({
        email: req.body.user.email,
        first_name: req.body.user.firstName,
        last_name: req.body.user.lastName,
        password: unhash_pass,
        user_level: 0
        })
      user.save(function(err) {
        if(err) {
          console.log("err from social update: ", err);
        }
        else {
          res.json("success update")
        }
      })
    }
    
  }



}





















