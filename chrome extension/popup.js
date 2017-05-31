
$( document ).ready(function() {
  // Handler for .ready() called.

  $.ajax({
              type: "GET", //or GET
              url: "https://linkbookmark.herokuapp.com",
              data:{},
              crossDomain:true,
              cache:false,

              success: function(msg){
                  //do some thing
                  console.log(msg);
                  if(msg=="true"){
                    console.log("sucess");
                    $("body").html(`<div class='container'>
                      <h4> Linkedin bookmark</h4>

                      <br>
                      <div class='row'>
                        <div class='col-md-1 col-xs-1'>
                        </div>
                        <div class='col-md-10 col-xs-10'>


                        <button  class='btn btn-primary btn-md' id="cl">Bookmark</button>
                        <br>
                        <br>
                          <a target="_black" href="https://linkbookmark.herokuapp.com"><button  class='btn btn-primary btn-md' >View </button></a>
                          <br><br>
                      <a target="_black" href="https://linkbookmark.herokuapp.com/logout"><button  class='btn btn-primary btn-md' >Logout</button></a>

                        </div>
                        <br>
                        <div class='col-md-1 col-xs-1'>

                        </div>

                      </div>


                    </div>

                    </body>`);

                    document.getElementById("cl").onclick=function(){

                      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        console.log(tabs[0].id);
                        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello",url:tabs[0]}, function(response) {



                        });
                      });



                    }
                  }
                  else{
                    console.log("failed");
                    $("body").html(`<div class='container'>
                      <h4> Linkedin bookmark</h4>

                      <br>
                      <div class='row'>
                        <div class='col-md-1 col-xs-1'>
                        </div>
                        <div class='col-md-10 col-xs-10'>


                      <a target="_black" href="https://linkbookmark.herokuapp.com/auth/linkedin">  <button  class='btn btn-primary btn-md' >Login</button></a>

                        </div>
                        <div class='col-md-1 col-xs-1'>

                        </div>

                      </div>


                    </div>

                    </body>`);

                  }
             },
             error: function(jxhr){

                  //do some thing
             }
           });






});
