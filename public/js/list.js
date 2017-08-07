$(document).ready(function(){
	$('button').addClass('w3-round w3-button');
	$('.date').each(function(index){
		const element = $(this),
			createdDate = new Date(element.attr('id'));
		compareDateWithDate(createdDate) 
			?	element.text(createdDate.getHours()+':'+createdDate.getMinutes())
			:	element.text(createdDate.getFullYear()+'/'+(createdDate.getMonth()+1)+'/'+createdDate.getDate());
	});
	$('.tList td[class!=noPlay]').click(function(){
		const element = $(this).parent();
		$.post('/play',{id:element.attr('id')},function(r){
			$('#detailView').html(r);
		});
	});
	$('#newBtn').click(function(){
		$.get('/insert',function(r){
			$('#listView').html(r);
		});
	});
	$('input[type=checkbox]').click(function(){
		const element = $(this);
		if(element.attr('class')=='tAllSelect'){
			$('input[type=checkbox]').each(function(){
				this.checked = element.is(':checked') ? true : false;
			});
		}
		if(element.attr('class')=='tSelect'){
			$('.tAllSelect')[0].checked = $(':checkbox[class!=tAllSelect]').length==$(':checked[class!=tAllSelect]').length ? true : false;
		}
	});
	$('#shuffleBtn').click(function(){
		if($(':checked').length==0){
			alert('Select shuffle list');
			return false;
		}
		$.post('/shuffle',$('input[type=checkbox]').serialize(),function(r){
			$('#detailView').html(r);
		});
	});
});
function compareDateWithDate(createdDate){
	const nowDate = new Date(),
	_comCrDt = new Date(createdDate.getFullYear(),createdDate.getMonth(),createdDate.getDate()),
	_comNowDt = new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate());
	return _comCrDt.getTime() == _comNowDt.getTime();
}