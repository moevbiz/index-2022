module.exports = {
    title: "Independent Space Index 2022",
    layout: "default",
    permalink: function(data) {
      return data.site.prelaunch && data.site.env == 'prod' ? 'home.html' : 'index.html'
    }
}