const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

module.exports = function(app, myDataBase) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
      });
        
      passport.deserializeUser((id, done) => {
        myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
          done(null, doc);
        });
      });

    //  Tell passport to use an instantiated LocalStrategy object with a few settings defined
    passport.use(new LocalStrategy(
        function(username, password, done) {
          myDataBase.findOne({ username: username }, function (err, user) {
            console.log('User '+ username +' attempted to log in.');
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { 
              return done(null, false);
            }
            return done(null, user);
          });
        }
    ));

}
    
    
    

 