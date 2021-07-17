/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// Test / driver code (temporary). Eventually will get this from the server.
 
//Cross-Site Scripting
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

$(document).ready(()=>{
  const URL = "http://localhost:8080"

  const createTweetElement = (tweetData) => {
    let time = timeago.format(tweetData.created_at);  
       
      let $tweet = $("<article>")
      $tweet.addClass("article-tweets")

      const html = `
     
      <header class="article-tweets-header">
        <div class ="name">
        <img name="profile_image" src="${tweetData.user.avatars}"/>
        <h3 class="article-tweets-header-name">${tweetData.user.name}</h3>
        </div>
        <h2 class="article-tweets-header-handle">${tweetData.user.handle}</h2>
      </header>
      <label for="article-tweet-text" class= "article-tweet-text-content">${escape(tweetData.content.text)}</label>
      <textarea name="text" id="article-tweet-text" class= "article-tweet-textarea"></textarea>
      <footer class="article-tweets-footer">
        <div class="article-tweets-footer-content">
          <label>${time}</label>
          <div class="article-tweets-footer-content-icon">
            <i class="fa fa-flag"></i>
            <i class="fa fa-expand"></i>       
            <i class="fa fa-heart"></i>          
          </div>           
        </div>       
      </footer>
     
          `       
     $tweet.append(html)
     return $tweet
  }
  const createErrorElement = (errorData) => {   
       
    let $error = $("<div>")
    $error.addClass("error-message")
      const html = `        
           <p> ${errorData}</p>     
      
          `
       
    $error.append(html)
    return $error
  }
  const renderTweets = (tweets) => {
      const tweetsContainer = $(".tweets-container")
      // loops through tweets
      // calls createTweetElement for each tweet
      // takes return value and appends it to the tweets container
      tweetsContainer.html("")
      tweets.forEach((tweet) => {
          
          tweetsContainer.prepend(createTweetElement(tweet))
      })
  }
  const renderErrors = (data) => {
    const errorSection = $(".error-message")
    // takes return value and appends it to the error container
    errorSection.html("")    
    errorSection.replaceWith(createErrorElement(data))   
}
 
  const loadtweets= () => {
      const params = {
          url: `${URL}/tweets`,
          method: "GET"
      }
      $.ajax(params)
    .then((tweets)=>{
      renderTweets(tweets)
    })
    .catch((err)=>{
        console.log(`err loading articles: ${err}`)
    })
    .always(()=>{
        console.log(`I'll always say this nomatter what`)
    })
  }
//   
    const showErrorMessage =(message)=>{
     $("#message-error-tweet-id").show();
     renderErrors(message);
     setTimeout(function(){ 
        //$("#message-error-tweet-id").hide();   
        $(".error-message").hide()
        $("#tweet-text").val("")// put the cursor back in the begining of the texterea
        $(".counter").text("140")
        $("#tweets-container").empty()
      }, 3000);
    }
  $("form").submit(function(event){
    event.preventDefault();
    if (event.target[0].value.length > 140 ){
      let errorMessageExample = "too long please respect our arbitrary limit of 140 chars."
      showErrorMessage(errorMessageExample)      
    } else if(event.target[0].value.length === 0){
      window.alert("the tweets can not be empty!")
    } else{
      $.ajax({
        method:"POST",
        url:`${URL}/tweets`,
        data:$(this).serialize()
      }) 
      .then(res=> {
      $("#tweet-text").val("")// put the cursor back in the begining of the texterea
      $(".counter").text("140") // to show decrising the 140 
      $("#tweets-container").empty() // privent having double tweets
      loadtweets()
      })
      .catch((err)=>{
        console.log(`err loading articles: ${err}`)
      })
      .always(()=>{
          console.log(`I'll always say this nomatter what`)
      })
    }
 })
 
 loadtweets()
 //implementation of fa-angle-double-down icon event to show or hide the new tweet textarea
 $(".btn-compose-tweet").click(function(){
   let $section = $("section.new-tweet");
   if($section.is(":visible")) {
     $section.slideUp("fast");

   } else {
    $section.slideDown("fast");
    $section.find("textarea").focus();
   }
 })
})


