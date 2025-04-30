runAfterAppReady(()=>{
    const testTarget = $(".target")
    const trigger = $(".input_wrap math-field")

    trigger.each(function(){
        $(this).on("input", function(){
            console.log(testTarget.val())
            if(testTarget.val() === "브로콜리" || testTarget.val() === "배추" || testTarget.val() === "무" || testTarget.val() === "파"){         
                console.log($(this).val())
                if($(this).val() === "△"){
                    console.log("삼각형")
                    
                }else if($(this).val() === "○×6"){
                    console.log("동그라미")
                }
            }else if(testTarget.val() === "부추" || testTarget.val() === "호박"){
               
            }
            
        });
    })
});