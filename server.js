require("dotenv").config();
const express = require("express");
const { NotionToMarkdown } = require("notion-to-md");
const app = express();

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const databaseId = '18049dfa184480a0b021c04ff6726c72';

let pages = [];

async function markdown(page_id) {
    const mdblocks = await n2m.pageToMarkdown(page_id);
    const mdString = n2m.toMarkdownString(mdblocks);
    
    return mdString;
}

function formatData(pages) {
    
}

async function getDatabase(callback) {
    const response = await notion.databases.query({ database_id: databaseId });
    
    for (let i = 0; i < response.results.length; i++) {
        const id = response.results[i].id;
        //const page = await notion.blocks.children.list({ block_id: id });

        const page = await markdown(id)
        
        pages.push(page)

    }

    formatData(pages)

    console.log(pages);
    callback();
}






app.use(express.static("public"));

app.get("/", function(request, response) {
    getDatabase(() => {
        response.send(pages);
    });
});

const listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
});

