export function checkUrl(url) {
  return new Promise(function (resolve, reject) {
    console.log("CHECK URL", url);
    try {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      /*
        xhr.setRequestHeader(“Access-Control-Allow-Origin”, “*”);
        xhr.setRequestHeader(
          “Access-Control-Allow-Methods”,
          “GET, POST, PATCH, PUT, DELETE, OPTIONS”
        );
        xhr.setRequestHeader(“Access-Control-Allow-Headers”, “*”);
      */
      xhr.onreadystatechange = function () {
        //console.log(“XHR “, xhr);
        if (xhr.readyState === 4) {
          //console.log(“XHR state 4 “, xhr);
          if (xhr.status >= 200 && xhr.status < 400) {
            //console.log(xhr.responseText);
            // this is commonjs ====require(“react”)
            resolve(true);
          } else {
            // status===0 is most likely invalid url...
            resolve(false);
          }
        }
      };
      xhr.onerror = function () {
        // this doesn’t show any error msg
        resolve(false);
      };
      xhr.send();
    } catch (e) {
      console.log("ERR", e);
      resolve(false);
    }
  });
}

// export function checkUrl(str) {
//   var pattern = new RegExp(
//     "^(https?:\\/\\/)?" + // protocol
//       "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
//       "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
//       "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
//       "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
//       "(\\#[-a-z\\d_]*)?$",
//     "i",
//   ); // fragment locator
//   return !!pattern.test(str);
// }
