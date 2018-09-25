var patterns = {
    'name':/^[\wА-Яа-яЁё]+$/u,
    'phone':/^[\d\(\)+-]{5,16}$/,
    'email':/^[\w_-]+@[\w_-]+\.\w+$/
};
var fade = 900;
var delay = 5000;
var buttonText = 'Отправить';
var buttonClass = 'btn btn-primary';
var keyAjax = true;

$(window).ready(function () {
    $('body').on('click','button',function(){
        switch($(this).attr('id')){
            case 'formLoad':
                formLoad();
                break;
            case 'reset':
                formClean();
                break;
        }
    });
});

function formLoad() {
    if(keyAjax){
        keyAjax = false;
        $.ajax({
            url: 'form.html',
            success: function (html) {
                if($('#modalForm').length === 0 ){
                    $('body').append(html);
                    formStart();
                }
            }
        })
    }

}

function formStart() {
    setTimeout(function () {
        $('#modalForm').modal('show').on('hidden.bs.modal',function () {
            $(this).remove();
        });
        keyAjax = true;
    }, delay);
    $('.modal-body').on('focus','input',function(){
        $(this).siblings('.label-placeholder').addClass('label-text');
    }).on('keyup','input',formValidate).on('blur','input',formIsBlur)
        .on('click','input',formClick);
}

function formValidate(event) {
    var item = $(this);
    if (item.val().length > 0) {
        item.siblings('.label-placeholder').addClass('label-text');
        item.removeClass('is-invalid');
        if(patterns[item.attr('name')] !== undefined){
            if(patterns[item.attr('name')].test(item.val()))
                item.removeClass('is-invalid').addClass('is-valid');
        }
    }
    formAddButton(event);
}

function formClick() {
    $(this).removeClass('is-invalid');
}

function formIsBlur() {
    var item = $(this);
    if (item.val().length > 0) {
        if(patterns[item.attr('name')] !== undefined){
            if(patterns[item.attr('name')].test(item.val()))
                item.removeClass('is-invalid').addClass('is-valid');
            else
                item.removeClass('is-valid').addClass('is-invalid');
        }
    }else{
        item.addClass('is-invalid');
        item.siblings('.label-placeholder').removeClass('label-text');
    }
}

function formAddButton(event) {
    var parent = $(event.delegateTarget);
    if(parent.find('[required]').length - parent.find('.is-valid').length === 0){
        $('<button></button>').addClass(buttonClass).attr('type','submit')
            .attr('tabindex','4').text(buttonText).on('click',{'parent':parent},formResult)
            .hide().fadeIn(900).appendTo($('.modal-footer:empty'));
    }
}

function formResultShow(event) {
    $('#formLoad').hide();
    $('#modalForm').modal('hide');
    $('#result').fadeIn(fade);
    $(event.data.parent).find('input').each(function (i,element) {
        $('#result').find('#'+$(element).attr('name')+'-text')
            .append('<span>'+$(element).val()+'</span>');
    })
}
function formResult(event) {
    $.ajax({
        url: 'result.html',
        success: function (html) {
            $('.container').append(html);
            formResultShow(event);
        }
    });
}

function formClean() {
    $('#result').fadeOut(fade).remove();
    $('#formLoad').fadeIn(fade);
}