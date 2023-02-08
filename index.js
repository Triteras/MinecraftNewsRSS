import axios from "axios";
import { json2xml } from "xml-js";
import express from "express";
import chalk from "chalk";

const app = express();

const PORT = 25545;

app.get("/news", (request, response) => {
  axios.get("https://launchercontent.mojang.com/news.json").then((result) => {
    let xml = json2xml(JSON.stringify(result.data), { compact: true });

    xml = xml.replaceAll("<entries>", "<item>");
    xml = xml.replaceAll("</entries>", "</item>");
    xml = xml.replaceAll(
      "/images/",
      "https://launchercontent.mojang.com/images/"
    );
    xml = xml.replaceAll("<readMoreLink>", "<link>");
    xml = xml.replaceAll("</readMoreLink>", "</link>");
    xml = xml.replaceAll("<text>", "<description>");
    xml = xml.replaceAll("</text>", "</description>");
    xml = xml.replaceAll("<date>", "<pubDate>");
    xml = xml.replaceAll("</date>", "</pubDate>");
    xml = xml.replaceAll("<newsPageImage>", "<image>");
    xml = xml.replaceAll("</newsPageImage>", "</image>");
    xml = xml.replaceAll("<dimensions>", "");
    xml = xml.replaceAll("</dimensions>", "");

    response.set("Content-type", "application/xml");
    response.type("application/xml");
    response.status(200).send(`
    <rss version="2.0">
      <channel>
        <title>Minecraft em Português</title>
        <description>Minecraft Oficial RSS</description>
        ${xml}
      </channel>
    </rss>`);
  });
});

app.listen(PORT);
console.log(chalk.green(`Server is online and running on port: ${PORT}`));
