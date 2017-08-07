$(document).ready(function(){
	const isUpdate = $('input[type=hidden').val() ? true : false,
		formUrl =  isUpdate ? '/update' : '/insert';
	setVolume(0.5);
	$('.button_container button').addClass('w3-button w3-round');
	$('.mainBody').addClass('w3-border w3-round w3-white w3-container w3-margin w3-padding-16');
	$('input[type=text]').addClass('w3-input w3-border w3-round');
	if(isUpdate){
		$('.strFileName-Success').text('Original file will be uploaded if you don\'t upload another file');
	}
	$('input').on({
		focus : function(){
			if($(this).attr('type')=='text'){
				$(this).addClass('w3-light-gray');
			}
		},
		blur : function(){
			if($(this).attr('type')=='text'){
				$(this).removeClass('w3-light-gray');
			}
		},
		change : function(){
			const element = $(this),
				error = $('.'+element.attr('id')+'-Error');
			element.attr('type')=='text'
				? lengthCheck(element,error) : fileCheck(element,error);
		}
	});
	$('button').click(function(){
		if($(this).attr('id')=='cancelBtn'){
			if(confirm('Are you sure to cancel writing?')){
				list();
			}
		}
		if($(this).attr('id')=='submitBtn'){
			$('input[type!=hidden]').each(function(index){
				const element = $(this),
					error = $('.'+element.attr('id')+'-Error');
				if((element.attr('type')=='text'? lengthCheck(element,error) : fileCheck(element,error))==false){
					alert(error.text());
					element.focus();
					return false;
				}
				if($('input[type!=hidden]').length-1 == index){
					const formData = new FormData($('form')[0]);
					$.ajax({
						url:formUrl,
						type:'POST',
						enctype:'multipart/form-data',
						data:formData,
						processData:false,
						contentType:false,
						success:function(r){
							console.log(status);
							if(r.success){
								alert('Successfully Submitted');
								list();
								if(isUpdate){
									$('#detailView').empty();
								}
							}
						}
					});
				}
			});
		}
	});
	function fileCheck(element,error){
		const success = $('.'+element.attr('id')+'-Success');
		if(element.val().length == 0){
			
			if(!isUpdate){
				success.text('');
				error.text('Select a mp3 file');
				return false;
			}else{
				error.text('');
				success.text('Original file will be uploaded');
				return true;
			}
		}
		const _lastDot = element.val().lastIndexOf('.');
		if(_lastDot == -1||element.val().substring(_lastDot+1,element.val().length).toLowerCase()!='mp3'){
			success.text('');
			error.text('Filename extension should be mp3');
			return false;
		}
		error.text('');
		success.text('Available File');
		return true;
	}
});
function list(){
	$.get('/list',function(r){
		$('#listView').html(r);
	});
}
function setVolume(volume){
	$('#originalPlayer').prop('volume',volume);
}

function lengthCheck(element,error){
	if(element.val().length == 0){
		error.text('Enter Value');
		setBorderColor(element,true);
		return false;
	}
	error.text('');
	setBorderColor(element,false);
	return true;
}
function setBorderColor(element,isRed){
	const removeSelector = isRed ? 'w3-border-green' : 'w3-border-red',
		addSelector = isRed ? 'w3-border-red' : 'w3-border-green';
	element.removeClass(removeSelector).addClass(addSelector);
}