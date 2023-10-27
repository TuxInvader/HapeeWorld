const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const fs = require('fs')

async function getReleases(number) {
    const html = await axios.get('https://www.haproxy.org/', {httpsAgent: new https.Agent({ keepAlive: false })}).catch(function (error) {
        console.log(`Axios Error: ${error}`);
    });
    try {
        const $ = await cheerio.load(html.data);
        let data = []
        let versions = []
        let releases = []
        let eols = []
        let latests = []
        let changelogs = []
        
        let lastblock = $('a[name="last"]')
    
        headings = []
        lastblock.find("tr").each((i,tr) => {
            
            if ( i > number ) {
                return;
            } else if ( i == 0 ) {
                $(tr).find("td").each((n,td) => {
                    headings.push($(td).text());
                });
            } else if ( i > 0 ) {
                let entry = {}
                $(tr).find("td").each((n,td) => {
                    entry[ headings[n] ] = $(td).html();
                });
                data.push(entry);
            }
        });
        return { result: "OK", items: data}
    } catch(error) {
        console.log(`Cheerio Error: ${error}`);
    };
}

async function getBlogs(number) {
    const html = await axios.get('https://www.haproxy.com/blog', {httpsAgent: new https.Agent({ keepAlive: false })}).catch(function (error) {
        console.log(`Axios Error: ${error}`);
    });
    try {
        const $ = await cheerio.load(html.data);
        let data = []
        let titles = []
        let images = []
        let links = []
        let paras = []
        $("body").each((i,elem) => {
            $(elem).find("article").find("h2").each((i,title) => {
                if ( i >= number ) { 
                    return;
                }
                titles.push($(title).text())
            });
            $(elem).find("article").find("img").each((i, img) => {
                images.push($(img).attr("src").replace("https://", "/proxy/"))
            }); 
            $(elem).find("article").find("h2").find("a").each((i, link) => {
                links.push($(link).attr("href"))
            })
            $(elem).find("article").find("p").each((i,para) => {
                paras.push($(para).text())
            });
        });
        for (let i = 0; i < titles.length; i++) {
            data.push( {
                title: titles[i],
                image: images[i],
                link: "https://www.haproxy.com" + links[i],
                para: paras[i]
            })
        }
        return { result: "OK", items: data}
    } catch(error) {
        console.log(`Cheerio Error: ${error}`);
    }
    
}

function parseStatic(filename, number, res) {
    
    fs.readFile(filename, {encoding: 'utf-8'}, function(error,data) {    
        let output = { "result": "OK", items: [] }  
        if (error) {
            output.result = "ERROR"
            output["details"] = error.message
            console.log(`FS Read Error: ${error}`)
        } else {
            items = JSON.parse(data);
            for (let i = 0; i< number ; i++) {
                output.items.push(items[i])
            }
        }
        res.status(200).send(output)
        res.end()
    });
    
}

exports.getBlogs = getBlogs;
exports.getReleases = getReleases;
exports.parseStatic = parseStatic;