import { readFileSync } from "node:fs";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import { HtmlBasePlugin } from "@11ty/eleventy";

// Adressen styrs från src/_data/site.yml, så domänbytet görs på ett ställe
const site = yaml.load(readFileSync("src/_data/site.yml", "utf8"));

// Markdown utan "smarta" citattecken, så att texterna står exakt som de skrivs
const md = markdownIt({ html: true, typographer: false, linkify: false });
const defaultLink = md.renderer.rules.link_open || ((t, i, o, e, s) => s.renderToken(t, i, o));
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  // Alla länkar öppnas i ny flik, som på gamla sajten
  tokens[idx].attrSet("target", "_blank");
  tokens[idx].attrSet("rel", "noopener");
  return defaultLink(tokens, idx, opts, env, self);
};

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({
    "src/bilder": "bilder",
    "src/dokument": "dokument",
    "src/assets": "assets",
    "src/ikoner": "/",
  });

  // Markdown till HTML: "md" ger stycken, "mdInline" en rad utan <p>
  eleventyConfig.addFilter("md", (s) => md.render(s || ""));
  eleventyConfig.addFilter("mdInline", (s) => md.renderInline(s || ""));
  // Motiveringen utan det som redan visas som citat
  eleventyConfig.addFilter("utanCitat", (text, citat) =>
    citat && text.startsWith(citat) ? text.slice(citat.length).trim() : text
  );
  eleventyConfig.addFilter("datum", (d) =>
    new Date(d).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDatum", (d) => new Date(d).toISOString().slice(0, 10));

  // "17.00", "17:00" eller 17 (YAML gör 17.00 till ett tal) blir [17, 0]
  const klockslag = (t) => {
    if (typeof t === "number") return [Math.floor(t), Math.round((t % 1) * 100)];
    const [h, m = 0] = String(t || "0").split(/[.:]/).map(Number);
    return [h, m];
  };
  eleventyConfig.addFilter("klockslag", klockslag);
  eleventyConfig.addFilter("tidText", (t) => klockslag(t).map((n) => String(n).padStart(2, "0")).join("."));
  // Sant om dagen inte har passerat ännu (räknat på hela dagen)
  eleventyConfig.addFilter("kommande", (d) => d && new Date(d).getTime() + 86400e3 > Date.now());
  // Hitta posten för ett visst år, t.ex. årets nypon till årtalsraden
  eleventyConfig.addFilter("hitta", (lista, ar) => (lista || []).find((x) => x.ar === ar));

  eleventyConfig.addCollection("inlagg", (api) =>
    api.getFilteredByGlob("src/inlagg/*.md").sort((a, b) => b.date - a.date)
  );

  return {
    dir: { input: "src", output: "_site" },
    pathPrefix: new URL(site.url).pathname,
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
