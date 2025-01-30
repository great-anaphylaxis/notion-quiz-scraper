require("dotenv").config();
const express = require("express");
const { NotionToMarkdown } = require("notion-to-md");
const app = express();

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const databaseId = '18049dfa184480a0b021c04ff6726c72';

async function markdown(page_id) {
    const mdblocks = await n2m.pageToMarkdown(page_id);
    
    return mdblocks;
}

function formatData(pages) {
    const items = [];

    for (const page of pages) {
        for (const block of page) {
            if (block.type !== 'toggle') {
                continue;
            }

            if (block.parent === 'Resources') {
                continue;
            }

            let lines = [];
            for (const line of block.children) {
                lines.push(line.parent);
            }

            const content = lines.join('\n');

            items.push({
                question: block.parent,
                answer: content
            });
        }
    }

    return items;
}

async function getDatabase(callback) {
    const pages = [];
    const response = await notion.databases.query({ database_id: databaseId });
    
    for (let i = 0; i < response.results.length; i++) {
        const id = response.results[i].id;

        const page = await markdown(id)
        
        pages.push(page)

    }

    const items = formatData(pages)

    callback(items);
}






app.use(express.static("public"));

app.get("/", function(request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.get("/script.js", function(request, response) {
    response.sendFile(__dirname + "/script.js");
});

app.get("/style.css", function(request, response) {
    response.sendFile(__dirname + "/style.css");
});

app.get('/data', function(request, response) {
    getDatabase((items) => {
        response.send(items);
    });
})

const listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
});

