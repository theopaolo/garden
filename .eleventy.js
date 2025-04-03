module.exports = function(eleventyConfig) {
    // Copy static assets to the output
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("img");

    // Add date formatting filter
    eleventyConfig.addFilter("formatDate", function(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });

    // Add collections for notes
    eleventyConfig.addCollection("notes", function(collectionApi) {
        return collectionApi.getFilteredByGlob("notes/**/*.md");
    });

    eleventyConfig.addCollection("rootNotes", function(collectionApi) {
        return collectionApi.getFilteredByGlob("notes/*.md");
    });

    eleventyConfig.addCollection("laboNotes", function(collectionApi) {
        return collectionApi.getFilteredByGlob("notes/labo/**/*.md");
    });

    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes",
            layouts: "_layouts"
        }
    };
};