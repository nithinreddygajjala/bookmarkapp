document.getElementById("cl").onclick=function(){

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs[0].id);
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello",url:tabs[0]}, function(response) {



    });
  });



}
