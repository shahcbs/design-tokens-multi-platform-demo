// platformconfig.js

function getStyleDictionaryConfig(theme) {
    return {
        "source": [
            `tokens/themes/${theme}.json`,
            "tokens/base/*.json"
        ],
        "platforms": {
            web: {
                transformGroup: "web",
                buildPath: `dist/web/${theme}/`,
                transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/rgb"],
                files: [{
                    destination: "variables.css",
                    format: "css/variables",
                    options: {
                        outputReferences: true
                    }
                }]
            },
            json: {
                transformGroup: "css",
                buildPath: `dist/json/${theme}/`,
                transforms: ["attribute/cti", "name/cti/camel", "size/object"],
                files: [
                    {
                        destination: "color.json",
                        format: "json/flat",
                        filter: {
                            attributes: {
                                category: "color"
                            }
                        }
                    },
                    {
                        destination: "size.json",
                        format: "json/flat",
                        filter: {
                            attributes: {
                                category: "size"
                            }
                        }
                    }
                ]
            },
        }
    };
}

module.exports = getStyleDictionaryConfig;
