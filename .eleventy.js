const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  // Copy static assets to the output
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/notes/**/*.{jpg,jpeg,png,gif,svg,webp}");

  // Rewrite relative image paths in notes so they resolve correctly
  // e.g. ![](img/photo.webp) in /notes/my-note/ → /notes/img/photo.webp
  eleventyConfig.addTransform("fixNoteImagePaths", function (content) {
    if (this.page.inputPath && this.page.inputPath.includes("/notes/")) {
      return content.replace(
        /(<img\s[^>]*src=")(?!\/|https?:\/\/)([^"]+)(")/g,
        '$1/notes/$2$3'
      );
    }
    return content;
  });
  // Add date formatting filter
  eleventyConfig.addFilter("formatDate", function (date) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const capitalize = (value) =>
      value.charAt(0).toUpperCase() + value.slice(1);

    const weekday = capitalize(
      new Intl.DateTimeFormat("fr-FR", { weekday: "long" })
        .format(parsedDate)
        .slice(0, 3)
    );

    const month = capitalize(
      new Intl.DateTimeFormat("fr-FR", { month: "long" })
        .format(parsedDate)
        .slice(0, 3)
    );

    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();

    return `${weekday} ${day} ${month} ${year}`;
  });

  // Add keys filter
  eleventyConfig.addFilter("keys", function (obj) {
    return Object.keys(obj);
  });

  // Add slice filter
  eleventyConfig.addFilter("slice", function (array, start, end) {
    return array.slice(start, end);
  });

  // Add collections for notes
  eleventyConfig.addCollection("notes", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob([
        "src/notes/**/*.md",
        "!src/notes/.trash/**",
        "!src/notes/.obsidian/**",
      ])
      .filter((item) => {
        const path = item.inputPath;

        // Skip system/hidden folders and navigation pages
        if (
          path.includes("/.trash/") ||
          path.includes("/.obsidian/") ||
          path.includes("/.git/") ||
          path.includes("/src/notes.njk") ||
          path.includes("/src/tags.njk") ||
          path.includes("/src/index.njk") ||
          path.includes("/src/labo.njk") ||
          item.data.layout === "base.njk"
        ) {
          return false;
        }

        // Only keep valid notes
        return item.data.title && (item.data.date || item.date);
      });
  });

  eleventyConfig.addCollection("rootNotes", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/notes/*.md")
      .filter(
        (item) =>
          !item.inputPath.includes("/.trash/") &&
          !item.url.endsWith("/") &&
          item.url.startsWith("/notes/")
      );
  });

  eleventyConfig.addCollection("laboNotes", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/notes/labo/**/*.md")
      .filter((item) => !item.inputPath.includes("/.trash/"));
  });

  eleventyConfig.addFilter("excludeItemByUrl", (collection, urlToExclude) => {
    if (!urlToExclude) {
      return collection;
    }
    return collection.filter((item) => item.url !== urlToExclude);
  });

  // Add tag collection
  eleventyConfig.addCollection("tagList", function (collection) {
    const tagSet = new Set();
    collection.getAll().forEach((item) => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") {
          tags = [tags];
        }
        tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return [...tagSet];
  });

  eleventyConfig.addPlugin(pluginRss.feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: {
      name: "notes",
      limit: 10,
    },
    metadata: {
      language: "fr",
      title: "Jardin num\u00e9rique",
      subtitle:
        "Cultiv\u00e9 par Th\u00e9o \u2014 d\u00e9veloppeur, designer, artiste, et parfois enseignant.",
      base: "https://jardin.ludique.dev",
      author: {
        name: "Th\u00e9o",
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
