window.onload = function(){
  let bt = document.getElementById("authAndLoadButton");
let name = document.createElement("div");
let img = document.createElement("img");
// loaderDiv.className = "loader";
//document.getElementById("title").insertAdjacentElement('afterend', loaderDiv);
// fetch("http://localhost:8000").then((res)=>{
//   res.text().then((final)=>{
//     loaderDiv.remove();
//     bt.onclick = function(){
//       chrome.tabs.update({url: final});
//       // window.close();
//     }
//   });
// }).catch((err)=>{
//   console.log(err);
// });

bt.addEventListener("click", function(){
  chrome.identity.getAuthToken({interactive: true}, function(token) {


    let init = {
      method: 'GET',
      async: true,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }};

//always remove keys

    fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=',
      init)
      .then((response) => response.json())
      .then(function(data) {
        name.innerHTML.fontcolor("black");
        // loaderDiv.innerHTML = data;

        document.getElementById("title").insertAdjacentElement('afterend', name);
        document.getElementById("title").insertAdjacentElement('afterend', img);
        
        name.innerHTML = data.items[0].snippet.title;
        img.src = data.items[0].snippet.thumbnails.medium.url;
        chrome.identity.removeCachedAuthToken({ 'token': token }, function(){

          let revokeurl = "https://oauth2.googleapis.com/revoke?token=" + token;

          fetch(revokeurl, {
            method: 'POST',
            mode : 'cors',
            headers: new Headers({
              'Content-Type' : 'application/x-www-form-urlencoded'
            })
          }).then(()=>{
            console.log('Token revoked');
          });
        })
      });
  });

});

};

