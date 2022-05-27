module.exports = {
    eleventyComputed: {
        // slug: function(data) {
        //     return data.id ?? this.slug(data.name);
        // },
        type: 'event',
        datestring: function(data) {
            return data.start;
        }
    }
}