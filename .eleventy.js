const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");

module.exports = function(config) {
    const md = new markdownIt({
        html: true
      });

    config.addLayoutAlias('default', 'layouts/base.njk');

    config.addCollection("locations", function(collection) {
        return collection.getFilteredByGlob("./src/locations/*.md").sort((a,b) => {
            if (a.data.slug > b.data.slug) return -1;
            else if (a.data.slug < b.data.slug) return 1;
            else return 0;
        }).reverse();
    });

    config.addCollection('program', function(collection) {
        return collection.getFilteredByGlob("./src/program/*.md");
    })

    config.addCollection('events', function(collection) {
        return collection.getFilteredByGlob("./src/events/*.md");
    })

    config.addCollection('programAndEvents', function(collection) {
        return collection.getFilteredByGlob(["./src/events/*.md", "./src/program/*.md"]);
    })

    config.addFilter('filterByLocation', function(collection, location) {
        if (!location) return;
        const filtered = collection.filter(item => item.data.location == location)
        return filtered;
    });

    config.addFilter('getCollectionItemBySlug', function(collection, slug) {
        const filtered = collection.filter(item => item.data.id == slug);
        return filtered[0];
    })


    config.addFilter("date", (date, format) => {
        return DateTime.fromJSDate(date).toFormat(format);
    });

    config.addShortcode('la', function(iconName) {
        return `<i class="la la-${iconName}"></i>`
    });

    config.addPairedShortcode("markdown", (content) => {
        return md.render(content);
    });

    config.addPassthroughCopy('./src/assets/images');
    config.addPassthroughCopy('./src/assets/fonts');
    config.addPassthroughCopy('./src/assets/documents');

    config.addFilter("plz", function(num) {
        if (num < 10) {
            num = `0${num}`
        }
        const PLZ = `1${num}0`
        return PLZ;
    });
    
    // ref the context
    let env = process.env.ELEVENTY_ENV;

    // cache buster
    const cacheBusterOptions = {
        outputDirectory: "docs",
    };

    // only run cache buster in prod
    if (env == 'prod') {
        config.addPlugin(cacheBuster(cacheBusterOptions));
    }
    
    // make the seed target act like prod
    // env = (env=="seed") ? "prod" : env;
    
    js = config.javascriptFunctions;

    // Base config
    return {
        passthroughFileCopy: true,
        dir: {
            input: "src",
            output: "docs",
            data: `_data`
        }
    };
}
