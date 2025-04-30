runAfterAppReady(() => {
    $(function () {
        $(".drag_item").draggable({
            revert: "invalid",
            containment: ".dragndrop_fraction_wrap",
            helper: "clone"
        });

        $(".drop_item").droppable({
            accept: function (draggable) {
                const dragPair = $(draggable).data("pair");
                const dropPair = $(this).data("pair");
                return dragPair === dropPair;
            },
            drop: function (event, ui) {
                const $drop = $(this);
                const $original = $(ui.draggable);
                const $clone = ui.helper.clone();

                $original.addClass("used");

                $clone.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    });

                $drop.empty().append($clone);
                //정답 체크 하기 
                const answer = $drop.attr("data-answer-single");
                const droppedValue = $original.attr("data-value") || "";

                if (answer && answer === droppedValue) {
                    $drop.data("correction", "true");
                    $drop.attr("data-correction", "true");
                    $(".btnCheck").addClass("active");
                } else {
                    $drop.data("correction", "false");
                    $drop.attr("data-correction", "false");
                }

                audioManager.playSound("drop");
            }
        });
        $(".btnReset").on("click", function () {
            $(".drop_item").each(function () {
                $(this)
                    .removeAttr("data-correction")
                    .data("correction", null)
                    .empty(); // 드롭된 클론 제거
            });
        
            $(".drag_item").each(function () {
                $(this).removeClass("used");
           
            });
 
            $(".btnCheck").removeClass("active");
        

        });
    });
});