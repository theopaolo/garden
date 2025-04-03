document.addEventListener("DOMContentLoaded", () => {
  console.log("transitions.js loaded");

  if ("navigation" in window && document.startViewTransition) {
    console.log("Navigation API & ViewTransition supported");

    navigation.addEventListener("navigate", (event) => {
      // Don't intercept links to external domains or with target attributes
      const toUrl = new URL(event.destination.url);
      if (toUrl.origin !== location.origin) return;

      event.intercept({
        handler: () =>
          document.startViewTransition(async () => {
            const response = await fetch(event.destination.url);
            const text = await response.text();
            const html = new DOMParser().parseFromString(text, "text/html");

            // Replace only the <main> content
            const newMain = html.querySelector("main");
            document.querySelector("main").replaceWith(newMain);

            // Optionally update title
            document.title = html.title;
          }),
      });
    });
  } else {
    console.log("Falling back to default navigation behavior");
  }
});