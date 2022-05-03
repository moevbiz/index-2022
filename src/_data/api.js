const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  let api = await EleventyFetch("https://independentspaceindex.at/spaces.json", {
    duration: "1h",
    type: "json"
  });

  return api;
};