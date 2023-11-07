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
  var api_server = get_cookie("site_api_host");
  var api_uri = location.protocol + "//" + api_server + "/v1/" + type + "?items=" + number
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

function get_connection_info(data) {
  let hapee_hw = get_cookie("hapee_hw")
  let hapee_sys = get_cookie("hapee_sys")
  process_item("cookie", {"result": "OK", "items": [ JSON.parse(hapee_hw) ] }, "hapee_hw", "table");
  process_item("cookie", {"result": "OK", "items": [ data ] }, "hapee_sys", "table");
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

function  draw_network( data ) {

  console.log("drawing data:")
  console.log(data)

  let servers = data.servers.split(',')
  let hapees = data.hapees.split(',')
  let local = data.local.replace(/::ffff:/, '')

  let dot = `digraph net {\n node [shape=box]\n nd_1 [ label = "CLT: ${data.xff}", color=cyan ]\n` 

  hapees.forEach( (hapee, idx1 ) => {

    if ( data.hostname == hapee ) {
      dot += ` nd_hap${idx1} [label = "HAP: ${hapee}", color = cyan, tooltip = "${data.xfp}://${data.host}", group = "HAPEE" ]\n`
      dot += ` nd_1 -> nd_hap${idx1} [label="${data.xfp}", color = cyan]\n`
    } else {
      dot += ` nd_hap${idx1} [label = "HAP: ${hapee}", color=grey, group = "HAPEE"]\n`
    }

    if ( idx1 > 0) {
      sdx = idx1 -1
      dot += ` nd_hap${sdx} -> nd_hap${idx1} [color=grey, dir = none]\n`
    }


    servers.forEach( (server, idx2) => {

      foundServer = false
      if ( ! servers.includes(local) ) {
        // must be NATed - Use port number
        port = server.replace(/^[^:]*:/, "")
        if ( local.endsWith(port)) {
          console.log(`found port: ${port}`)
          foundServer = true
        }
      } else {
        if ( server == local ) {
          console.log("found match")
          foundServer = true
        }
      }

      if ( foundServer == true ) {
        if ( idx1 == 0 ) {
          dot += ` nd_s${idx2} [ label = "SVR: ${server}", color=cyan, group = "SERVERS"]\n`
        }
        if (data.hostname == hapee) {
          dot += ` nd_hap${idx1} -> nd_s${idx2} [color=cyan]\n`
        } else {
          dot += ` nd_hap${idx1} -> nd_s${idx2} [color=grey, dir = none]\n`
        }
        
      } else {
        console.log("not found")
        if ( idx1 == 0 ) {
          dot += ` nd_s${idx2} [ label = "SVR: ${server}", color=grey, group = "SERVERS"]\n`
        }
        dot += ` nd_hap${idx1} -> nd_s${idx2} [color=grey, dir = none]\n`
      }
    })

  }) 
  dot += "}\n"

  console.log("drawing DoT:")
  console.log(dot)

  let parsedData = vis.parseDOTNetwork(dot)
  let net = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }
  let container = document.getElementById("network-div")
  let options = { 
    layout: {
      hierarchical: {
        enabled: false
      }
    },
    physics: { 
      hierarchicalRepulsion: { 
        nodeDistance: 300, 
        springLength: 200, 
        avoidOverlap: 1 }
      }
    }

  let network = new vis.Network(container, net, options);
}