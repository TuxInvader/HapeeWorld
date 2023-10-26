function process_item(type, data, outputElement, outputType) {
  var output = document.getElementById(outputElement)
  if ( data.result != "OK" ) {
    output.innerHTML = "<p>Failed to get " + type + " :-( <br/>The Errors was: " + data.details + "</p>"
    return
  }
  if ( data.items == 0 ) {
    output.innerHTML = "<p>Failed to get " + type + " :-( <br/>The Errors was: No Cheeses found </p>"
    return
  }

  console.log(`Need to Process ${data.items.length} items`)
  htmlout = ""
  if (outputType == "card") {
    htmlout += '<div class="container">'
    for ( let i=0; i < data.items.length; i=i+2) {
      console.log(`Processing ${i}`)
      htmlout += `
        <div class="row h-auto py-2">
          <div class="col-sm w-50 d-flex align-items-stretch">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${data.items[i].title}</h5>
                <p class="card-text">${data.items[i].para}</p>
                <a href="${data.items[i].link}" class="btn btn-primary">Read Article</a>
              </div>
              <img src="${data.items[i].image}" class="card-image-bottom">
            </div>
          </div>
      `
      if ( i+1 < data.items.length ) {
        htmlout += `
            <div class="col-sm w-50 d-flex align-items-stretch">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${data.items[i+1].title}</h5>
                  <p class="card-text">${data.items[i+1].para}</p>
                  <a href="${data.items[i+1].link}" class="btn btn-primary">Read Article</a>
                </div>
                <img src="${data.items[i+1].image}" class="card-image-bottom">
              </div>
            </div>
          </div>
        `
      } 
    }
    htmlout += '</div>'
  } else if (outputType == "table") {
    for ( let i=0; i < data.items.length; i++ ) {
      console.log(`Processing ${i}`)
      if ( i == 0 ) {
        htmlout += "<thead><tr>"
        Object.keys(data.items[i]).forEach( key => {
          htmlout += `<th scope="col">${key}</th>`;
        });
        htmlout += "</tr></thead><tbody>";
      } 
      htmlout += "<tr>"
      Object.keys(data.items[i]).forEach( key => {
        htmlout += `<td>${data.items[i][key]}</td>`
      });
      htmlout += "</tr>"
    }
    htmlout += "</tbody>"
  }
  output.innerHTML = htmlout;
}

function get_blogs() {
  get_resources("blogs", "accordionblogs", "card")
}

function get_releases() {
  get_resources("releases", "releasetable", "table")
}

function get_resources(type, outputElement, outypeType, number=1) {
  var xmlhttp;
  var web = location.hostname.split('.')
  web[0] = 'api'
  var api_uri = location.protocol + "//" + web.join('.') + "/v1/" + type + "?items=" + number
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onload=function()
  {
    if (xmlhttp.status==200)
    {
      var data = JSON.parse(xmlhttp.response);
      process_item(type, data, outputElement, outypeType);
    } else {
      var data = { "result": "ERROR", "details": xmlhttp.status + ": " + xmlhttp.statusText }
      console.log(xmlhttp);
      process_item(type, data, outputElement);
    }
  }
  xmlhttp.onerror=function()
  {
    var data = { "result": "ERROR", "details": xmlhttp.status + ": " + xmlhttp.statusText }
    process_item(type, data, outputElement);
  }
 
  xmlhttp.open("GET", api_uri, true );
  xmlhttp.send();
}

function get_connection_info() {
  let hapee_hw = get_cookie("hapee_hw")
  let hapee_sys = get_cookie("hapee_sys")
  process_item("cookie", {"result": "OK", "items": [ JSON.parse(hapee_hw) ] }, "hapee_hw", "table");
  process_item("cookie", {"result": "OK", "items": [ JSON.parse(hapee_sys) ] }, "hapee_sys", "table");
}

function get_cookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
