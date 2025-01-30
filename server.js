require("dotenv").config();
const express = require("express");
const app = express();

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

let blocks = [];

async function getDatabase(callback) {
    const databaseId = '18049dfa184480a0b021c04ff6726c72';
    const response = await notion.databases.query({ database_id: databaseId });
    
    for (let i = 0; i < response.results.length; i++) {
        const id = response.results[i].id;
        const page = await notion.blocks.children.list({ block_id: id });
        
        blocks.push(page.results)

    }


    console.log(blocks);
    callback();
}






app.use(express.static("public"));

app.get("/", function(request, response) {
    getDatabase(() => {
        response.send(blocks);
    });
});

const listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
});

