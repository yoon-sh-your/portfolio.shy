
runAfterAppReady(function () {

    $(document).ready(function() {
      $(".img_box.rotation").click(function(){
        $(this).find('.rotation_box').addClass('active');
        $(this).find('.txt').hide();
      });
    });
  
});
