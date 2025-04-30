runAfterAppReady(() => {
    var helpBubble = $(".right_box");
    window.onCorrectCustom = function () {
        console.log(helpBubble);
        helpBubble.show();
    };
    
    window.onIncorrectTwiceCustom = function () {
        console.log(helpBubble);
        helpBubble.show();
      };

      window.resetCustom = function () {
        helpBubble.hide();
      };
});