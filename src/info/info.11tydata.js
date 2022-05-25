module.exports = {
    eleventyComputed: {
        template: 'default',
        permalink: data => {
            if (data.page.fileSlug == 'info') {
                return data.site.prelaunch == true 
                && data.site.env == 'prod'
                ? 'index.html' : 'info/index.html';
            } else if (data.page.fileSlug.includes('_')) return false;
        }
    }
};