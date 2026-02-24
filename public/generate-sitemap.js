const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

// 🔥 Yaha manually blog list define karo
const blogs = [
  {
    slug: "why-preparation-for-ssb-for-the-army-navy-and-air-force-follows-the-same-principles",
    updatedAt: "2026-02-24"
  },
  {
    slug: "how-to-crack-ssb-interview",
    updatedAt: "2026-02-20"
  }
];

const BASE_URL = "https://ssbwithisv.in";

async function generateSitemap() {

  const links = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/blogs", changefreq: "weekly", priority: 0.9 },
    { url: "/Courses", changefreq: "monthly", priority: 0.8 }
  ];

  blogs.forEach((blog) => {
    links.push({
      url: `/blogs/${blog.slug}`,
      lastmod: blog.updatedAt,
      changefreq: "weekly",
      priority: 0.7
    });
  });

  const stream = new SitemapStream({ hostname: BASE_URL });

  const xml = await streamToPromise(
    Readable.from(links).pipe(stream)
  ).then((data) => data.toString());

  fs.writeFileSync("./public/sitemap.xml", xml);

  console.log("✅ Sitemap Generated!");
}

generateSitemap();