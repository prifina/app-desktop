const { Client } = require("@notionhq/client");

const fs = require("fs");
// Initializing a client
const notion = new Client({
  auth: process.env.NOTION, // process.env.NOTION_TOKEN,
});

async function doScanTexts(query, resultSet, lastKey, callBack) {
  const params = Object.assign({}, query, {
    start_cursor: lastKey,
  });

  try {
    console.log("SCAN PARAMS ", params);
    const data = await notion.databases.query(params);
    console.log("SCAN ", Object.keys(data));
    console.log("SCAN2 ", data.results.length, data.has_more);
    const set = resultSet.concat(data.results);

    if (typeof data.has_more !== "undefined" && data.has_more) {
      doScanTexts(query, set, data.next_cursor, callBack);
    } else {
      callBack(null, set);
    }
  } catch (e) {
    callBack(`Unable to query. Error JSON: ${JSON.stringify(e)}`);
  }
}

function getTexts(query) {
  return new Promise((resolve, reject) => {
    const resultSet = [];
    const NextCursor = undefined;
    doScanTexts(query, resultSet, NextCursor, (err, data) => {
      if (err) {
        console.log(err);
        //reject(`Unable to query. Error JSON: ${JSON.stringify(err)}`)
        resolve([]);
      } else {
        resolve(data);
      }
    });
  });
}

async function main() {
  const myPage = await getTexts({
    database_id: "ddca09c553c243f3902604462fe24936",
  });

  return myPage;
}

async function main2() {
  /*
    {
        database_id: "ddca09c553c243f3902604462fe24936",
        start_cursor: lastKey}
*/
  const myPage = await notion.databases.query({
    database_id: "ddca09c553c243f3902604462fe24936",
    start_cursor: "ef439bde-0eca-4570-903c-9133a93cbf88",
    /*
      filter: {
        property: "Landmark",
        text: {
          contains: "Bridge",
        },
      },*/
  });

  return myPage;
}

async function main3() {
  const pageId = "8e8619f2922248b4a53a7c7f1cddf51a";
  return await notion.pages.retrieve({
    page_id: pageId,
    start_cursor: "ef439bde-0eca-4570-903c-9133a93cbf88",
  });
}

main().then(res => {
  console.log(typeof res, res.length);

  let texts = {};
  res.forEach(r => {
    //console.log(r.id, r.url, Object.keys(r.properties));
    /*
    [
        'In Atom components',
        'Usage Context',
        'Status',
        'Media Assets',
        'CMS Need',
        'Related Screens',
        'UI Text',
        'In Apps',
        'Lang.',
        'In User Stories',
        'In Common Components',
        'Text Identifier String'
      ]
      */
    // console.log(r.properties["Lang."]);
    // console.log(r.properties["Text Identifier String"].title[0].plain_text);

    if (
      r.properties["UI Text"].hasOwnProperty("rich_text") &&
      r.properties["UI Text"].rich_text.length > 0
    ) {
      //console.log(r.properties["UI Text"].rich_text[0].plain_text);
      if (r.properties["UI Text"].rich_text[0].hasOwnProperty("plain_text")) {
        /*
        console.log(
          "=>",
          r.properties["Text Identifier String"].title[0].plain_text,
        );
        console.log(
          "==",
          r.properties["UI Text"].rich_text[0].plain_text.replace(/\n/g, ""),
        );*/

        texts[r.properties["Text Identifier String"].title[0].plain_text] =
          r.properties["UI Text"].rich_text[0].plain_text.replace(/\n/g, "");
        //words.replace(/\n/g, " ");
      } else {
        console.log(Object.keys(r.properties["UI Text"].rich_text[0]));
        console.log(
          "EMPTY2 ",
          r.properties["Text Identifier String"].title[0].plain_text,
        );
      }
    } else {
      /*
      console.log(
        "EMPTY ",
        r.properties["Text Identifier String"].title[0].plain_text,
      );
      */
      texts[r.properties["Text Identifier String"].title[0].plain_text] =
        r.properties["Text Identifier String"].title[0].plain_text;
    }
  });
  // console.log(texts);
  console.log(Object.keys(texts).length);
  fs.writeFileSync("./en.js", "const strings = {\n");
  fs.appendFileSync("./en.js", "en: {\n");
  Object.keys(texts).forEach(t => {
    let key = t;
    if (key.indexOf("-") > -1) {
      key = "'" + key + "'";
    }
    fs.appendFileSync("./en.js", `${key}:"${texts[t]}",\n`);
  });

  fs.appendFileSync("./en.js", "}};\n");
  fs.appendFileSync("./en.js", "export default { ...strings };\n");
});
