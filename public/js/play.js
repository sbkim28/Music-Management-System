$(document).ready(function(){
	setVolume($('#volumeCon').text());
	let setPlayNum = 2;
	setPlay(setPlayNum);
	$('.buttons button').addClass('w3-button w3-round w3-margin w3-text-white');
	$('#musicPlayer').on({
		volumechange:function(){
			setVolume($(this)[0].volume);
		},
		ended:function(){
			if($('.playlist').is('ul')){
				setPlayNum++;
				setPlay(setPlayNum);
			}
		}
	});
	$('#deleteBtn').click(function(){
		if(confirm('Are you sure to delete this?')){
			$.post('/delete',$('input#id').serialize(),function(r){
				if(r.success){
					alert('Successfully removed');
					$('#detailView').empty();
					$.get('/list',function(r){
						$('#listView').html(r);
					});
				}else{
					alert('Error Occured while deleting data. Try again.');
				}
			});
		}
	});
	$('#updateBtn').click(function(){
		$.get('/update/'+$('input#_id').val(),function(r){
			$('#musicPlayer')[0].pause();
			$('#listView').html(r);
		});
	});
	let dragSrcEl = null;
	$('.playlist .selectable').on({
		click:function(){
			setPlayNum = $(this).index()+1;
			setPlay(setPlayNum);
		},
		dragstart:function(e){
			$(this).css('opacity','0.4');
			dragSrcEl=$(this);
			e.originalEvent.dataTransfer.effectAllowed = 'move';
		},
		dragover:function(e){
			if(!e.isPreventDefault){
				e.preventDefault();
			}
			e.originalEvent.dataTransfer.dropEffect='move';
			return false;
		},
		drop(e){
			if(!e.isPropagationStopped){
				e.stopPropagation();
			}
			const element = $(this);
			if(dragSrcEl.attr('id') != element.attr('id')){
				const getDataId = dragSrcEl.attr('id'),
					getDataClass = dragSrcEl.attr('class'),
					getDataHtml = dragSrcEl.html();
				dragSrcEl.attr({'id':element.attr('id'),'class':element.attr('class')});
				dragSrcEl.html(element.html());
				$(this).attr({'id':getDataId,'class':getDataClass});
				$(this).html(getDataHtml);
				setPlayNum = $('.routineColor').index()+1;
			}
			return false;
		},
		dragend(e){
			$('.selectable').css('opacity','1');
		}
	});
});
function setPlay(n){
	const element = $('.playlist li:nth-child('+n+')');
	if(element.is('li')){
		const filename = element.attr('id');
		$('#musicPlayer source').attr('src','/audio/'+filename);
		$('#musicPlayer')[0].load();
		$('#musicPlayer')[0].play();
	}
	element.addClass('routineColor');
	$('.playlist li[id!="'+element.attr('id')+'"]').removeClass('routineColor');
}
function setVolume(volume){
	$('#musicPlayer').prop('volume',volume);
	$('#volumeCon').text(volume);
}