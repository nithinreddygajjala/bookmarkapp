
         $(document).ready(function(){
          console.log(" Hello world");


          chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){

            console.log(request );

            $.ajax({
                        type: "POST", //or GET
                        url: "https://linkbookmark.herokuapp.com/bookmark",
                        data:{name : request.name,place:request.place,title:request.title,pic:request.pic,note:request.note,url:request.url},
                        crossDomain:true,
                        cache:false,

                        success: function(msg){
                            //do some thing

                       },
                       error: function(jxhr){

                            //do some thing
                       }
                     });
          });
         });
