const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const musicVO = mongoose.Schema({
	strMusic:{type:String,required:true},
	strArtist:{type:String,required:true},
	dateCreated:{type:Date,default:Date.now()},
	strFileName:{type:String,required:true}
});
module.exports = mongoose.model('music',musicVO);
