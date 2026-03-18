/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://iskra.com.co',
  generateRobotsTxt: true,

  additionalPaths: async () => {
    const locales = ['es', 'en']
    const routes = ['', '/servicios', '/colaboraciones']

    const paths = []

    locales.forEach((locale) => {
      routes.forEach((route) => {
        paths.push({
          loc: `/${locale}${route}`,
          changefreq: 'weekly',
          priority: route === '' ? 1.0 : 0.7,
          lastmod: new Date().toISOString()
        })
      })
    })

    return paths
  }
}
