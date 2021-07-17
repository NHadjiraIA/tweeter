$(document).ready(function() {
  // --- our code goes here ---
  
  $("#tweet-text").on("keyup",function (){          
        var count = $(this).val().length;  
         
        let counter = 140 - count;            
        $("#tweet-text-counter").html(counter)        
       if (count > 140 ){
         $("#tweet-text-counter").css("color", "red");
       }else {
        $("#tweet-text-counter").css("color", "black");
       }     
  
  })  
 
});
