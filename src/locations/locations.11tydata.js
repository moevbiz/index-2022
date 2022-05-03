module.exports = {
    permalink: false,
    eleventyComputed: {
        slug: function(data) {
            return this.slug(data.name);
        },
        apiData: data => data.api.find(e => e.uid == data.id),
        name: data => getProperty('name', data),
        address: data => getProperty('address', data),
        district: data => getProperty('district', data),
        website: data => getProperty('website', data),
        prettyurl: data => getProperty('prettyurl', data),
        lat: data => getProperty('lat', data),
        lng: data => getProperty('lng', data),
    }
}

const getProperty = (propertyName, eleventyData) => {
    if (eleventyData[propertyName] != undefined && eleventyData[propertyName].length != 0) {
        return eleventyData[propertyName];
    } else if (eleventyData.apiData != undefined) { 
        return eleventyData.apiData[propertyName];
    } else {
        return 'none';
    }
};