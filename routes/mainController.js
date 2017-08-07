const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
	destination:(req,file,func)=>{
		func(null,'./public/audio');
	},
	filename:(req,file,func)=>{
		func(null,Date.now()+'_'+file.originalname);
	}
});
const upload = multer({storage:storage}).single('strFileName');
module.exports = (app,musicDTO)=>{
	app.get('/',(req,res)=>{
		res.render('index');
	});
	app.get('/list',(req,res,next)=>{
		musicDTO.find().sort({dateCreated:-1}).exec((err,data)=>{
			if(err) return next(err);
			res.render('list',{list:data});
		});
	});
	app.get('/insert',(req,res)=>{
		const _dto = new musicDTO();
		_dto._id = null;
		res.render('input_form',{item:_dto});
	});
	app.post('/insert',(req,res,next)=>{
		console.log(req.body);
		upload(req,res,(err)=>{
			if(req.file == undefined) return next(new Error('Unexpected Error during uploading files'));
			req.body.strFileName = req.file.filename;
			const _dto = new musicDTO(req.body);
			_dto.save((err)=>{
				if(err) return next(err);
				res.json({success:true});
			});
		});
	});
	app.post('/play',(req,res,next)=>{
		musicDTO.findById(req.body.id,(err,item)=>{
			if(err) return next(err);
			if(!item) return next(new Error('Cannot find Data'));
			res.render('play',{item:item});
		});
	});
	app.post('/delete',(req,res,next)=>{
		unlink(req.body.id,(err)=>{
			if(err){
				musicDTO.remove({_id:req.body.id},(err1)=>{
					if(err1) return next(err1);
					return next(err);
				});
			}else{
				musicDTO.remove({_id:req.body.id},(err)=>{
					if(err) return next(err);
					res.json({success:true});
				});
			}
		});
		
	});
	app.get('/update/:id',(req,res,next)=>{
		musicDTO.findById(req.params.id,(err,item)=>{
			if(err) return next(err);
			if(!item) return next(new Error('Cannot find Data'));
			res.render('input_form',{item:item});
		});
	});
	app.post('/update',(req,res,next)=>{
		upload(req,res,(err)=>{
			if(req.file == undefined){
				musicDTO.findById(req.body.id,(err,item)=>{
					if(err) return next(err);
					if(!item) return next(new Error('Cannot find Data'));
					req.body.strFileName = item.strFileName;
				});
			}else{
				req.body.strFileName = req.file.filename;
				unlink(req.body.id,function(err){
					if(err) return next(err);
				});
			}
			musicDTO.update({_id:req.body.id},{$set:req.body},(err)=>{
				if(err) return next(err);
				res.json({success:true});
			});
		});
	});
	app.post('/shuffle',(req,res,next)=>{
		console.log(req.body);
		musicDTO.find({_id:{$in:req.body.shuffleList}},(err,data)=>{
			if(err) return next(err);
			if(!data.length) return next(new Error('Cannot find Data'));
			data.sort(function(a,b){return 0.5-Math.random()});
			res.render('shuffle',{list:data});
		});
	});
	function unlink(id,callback){
		musicDTO.findById(id,(err,data)=>{
			if(err) return callback(err);
			if(!data) return callback(new Error('Cannot find Data'));
			fs.unlink('./public/audio/'+data.strFileName,(err)=>{
				if(err){
					console.log('File wasn\'t fully removed');
					console.error(err);
					return callback(err);
				}
				return callback(null);
			});
		});
	}
};
