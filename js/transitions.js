document.addEventListener("DOMContentLoaded", () => {
  if ("navigation" in window && document.startViewTransition) {
    navigation.addEventListener("navigate", (event) => {
      const toUrl = new URL(event.destination.url);
      if (toUrl.origin !== location.origin) return;

      event.intercept({
        handler: async () => {
          document.startViewTransition(async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 300));

              const response = await fetch(event.destination.url);
              const text = await response.text();
              const html = new DOMParser().parseFromString(text, "text/html");

              const newMain = html.querySelector("main");
              document.querySelector("main").replaceWith(newMain);

              document.title = html.title;

              window.scrollTo(0, 0);
              
            } catch (error) {
              console.error("Transition failed:", error);
            }
          });
        },
      });
    });
  } else {
    console.log("Falling back to default navigation behavior");
  }
});