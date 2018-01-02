// var mongoose = require('mongoose');
// var carsSchema = new mongoose.Schema({
//   name:{
//     type:String,
//     required:true,
//     minlength:1,
//     trim:true
//   },
//   seater:{
//     type:String,
//     required:true,
//     minlength:1,
//     trim:true
//   },
//   rateWeekdays:{
//     type:String,
//     required:true,
//     minlength:1,
//     trim:true
//   },
//   rateWeekend:{
//     type:String,
//     required:true,
//     minlength:1,
//     trim:true
//   }
// });
// carsSchema.methods.toJSON = function () {
//   var car = this;
//   var carObject = car.toObject();
//   console.log(JSON.stringify(carObject));
//   return _.pick(carObject, ['name', 'seater', 'rateWeekdays','rateWeekend']);
// };
//
// var cars = mongoose.model('cars', carsSchema);
// module.exports = {cars};
