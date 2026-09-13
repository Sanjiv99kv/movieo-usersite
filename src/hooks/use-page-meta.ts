import { useEffect } from "react";

export type PageMeta = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
};

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/** Keeps <title> and the social meta tags in sync with the page being rendered. */
export function usePageMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  twitterCard = "summary_large_image",
}: PageMeta) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", ogTitle ?? title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      ogDescription ?? description,
    );
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", twitterCard);
  }, [title, description, ogTitle, ogDescription, twitterCard]);
}
