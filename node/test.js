const { imageSearch, randomImage, closeBrowser } = require("./index");

async function run() {
  try {
    console.log("=== imageSearch (bing+ddg default) ===");
    const cats = await imageSearch("cat", { n: 5 });
    cats.forEach((u) => console.log(" ", u));

    console.log("\n=== randomImage ===");
    const rand = await randomImage("sunset");
    console.log(" ", rand);

    console.log("\n=== bing only ===");
    const dogs = await imageSearch("dog", { engines: ["bing"], n: 3 });
    dogs.forEach((u) => console.log(" ", u));

    console.log("\n=== ddg only ===");
    const birds = await imageSearch("bird", { engines: ["ddg"], n: 3 });
    birds.forEach((u) => console.log(" ", u));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await closeBrowser();
  }
}

run();
