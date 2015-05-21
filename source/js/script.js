(function($){
  var toTop = $('#toTop').offset().top - $(window).height() + 20;

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Profile card
  $(document).on('click', function () {
    $('#profile').removeClass('card');
  }).on('click', '#profile-anchor', function (e) {
    e.stopPropagation();
    $('#profile').toggleClass('card');
  }).on('click', '.profile-inner', function (e) {
    e.stopPropagation();
  });

  // To Top
  $(document).on('scroll', function () {
    if ($(document).width() >= 800) {
      if($(this).scrollTop() > toTop) {
        $('#toTop').addClass('fix');
        $('#toTop').css('left', $('#sidebar').offset().left);
      } else {
        $('#toTop').removeClass('fix');
      }
    } else {
      $('#toTop').addClass('fix');
      $('#toTop').css('right', 20);
    }
  }).on('click', '#toTop', function () {
    $('html,body').animate({scrollTop:0},300);
  });

  //开发者console
    console.log('%c','background:url(http://arayzou.qiniudn.com/personal/Aray1_sumiao.jpg);padding:43px 50px;line-height:100px;height:1px;border-radius:50px;background-size:100px 100px;')
    console.log('邹瑞的前端博客：http://arayzou.com \n\n如果你遇到BUG或者对代码有建议，欢迎联系我~ \nQQ:4751738(邹瑞) \nE-mail:zrxldl@gmail.com');
    console.log('github地址：https://github.com/ArayZou');
})(jQuery);
