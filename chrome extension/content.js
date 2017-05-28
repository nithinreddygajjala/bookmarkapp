
$(window).on('load',function()
{


});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
console.log(chrome.runtime.id );
    $.get( "chrome-extension://" + chrome.runtime.id + "/modal.html", function( data ) {

        $(".body").append(data);

    });
    setTimeout(function(){
      var span = document.getElementsByClassName("close")[document.getElementsByClassName("close").length - 1];
      console.log(span);

      var fullName = $(".pv-top-card-section__name").text();
      profilePic = $(".pv-top-card-section__photo > img")[0].src;

      title = $(".pv-top-card-section__headline").text();


      locationElement = document.getElementsByClassName("pv-top-card-section__location")[0];

      place = $(locationElement).text();

      console.log(place);

      console.log(request.url.url);
      console.log(sender);

      							var modal = document.getElementsByClassName("modal")[document.getElementsByClassName("modal").length - 1];
                    $(".modal-name").text(fullName);
                    $(".modal-location").text(place);

                    $(".modal-jobrole").text(title);
                      $(".mt-sprite").css('background-image', "url(" + profilePic + ")");


      $(span).ready(function(){
        $(span).on("click", function() {
            modal.style.display = "none";

            $(".mt-LinkedIn-Modal").remove();

        });
      });


$(".saveNotes").on('click',function(){



console.log();
var x=$(".bookmarkNotesBox").val();
console.log(request.url.url)
chrome.runtime.sendMessage({name:fullName,place:place,title:title,pic:profilePic,note:x,url:request.url.url}, function(response) {
    console.log("message sent ");
});

$(".mt-LinkedIn-Modal").remove();
});



    },500);

  sendResponse("nithin reddy gajjala");
  });
