module.exports = function(eleventyConfig) {
    // Ignore specific directories
    eleventyConfig.ignores.add("src/notes/.trash/**");

    // Copy static assets to the output
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/img");

    // Add date formatting filter
    eleventyConfig.addFilter("formatDate", function(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });

    // Add keys filter
    eleventyConfig.addFilter("keys", function(obj) {
        return Object.keys(obj);
    });

    // Add slice filter
    eleventyConfig.addFilter("slice", function(array, start, end) {
        return array.slice(start, end);
    });

    // Add collections for notes
    eleventyConfig.addCollection("notes", function(collectionApi) {
        return collectionApi.getFilteredByGlob(["src/notes/**/*.md", "!src/notes/.trash/**", "!src/notes/.obsidian/**"])
            .filter(item => {
                // Exclude files from special directories
                if (item.inputPath.includes(".trash") ||
                    item.inputPath.includes(".obsidian") ||
                    item.inputPath.includes(".git")) {
                    return false;
                }
                // Make sure the file has required frontmatter
                return item.data.title && item.data.date;
            });
    });

    eleventyConfig.addCollection("rootNotes", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/notes/*.md")
            .filter(item =>
                !item.inputPath.includes("/.trash/") &&
                !item.url.endsWith("/") &&
                item.url.startsWith("/notes/")
            );
    });

    eleventyConfig.addCollection("laboNotes", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/notes/labo/**/*.md")
            .filter(item => !item.inputPath.includes("/.trash/"));
    });

    eleventyConfig.addFilter("excludeItemByUrl", (collection, urlToExclude) => {
        if (!urlToExclude) {
            return collection;
        }
        return collection.filter(item => item.url !== urlToExclude);
    });

    // Add tag collection
    eleventyConfig.addCollection("tagList", function(collection) {
        const tagSet = new Set();
        collection.getAll().forEach(item => {
            if ("tags" in item.data) {
                let tags = item.data.tags;
                if (typeof tags === "string") {
                    tags = [tags];
                }
                tags.forEach(tag => tagSet.add(tag));
            }
        });
        return [...tagSet];
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_layouts"
        }
    };
};