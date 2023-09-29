const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

function getStyleDictionaryConfig(platform) {
    return {
        "source": [
            `tokens/**/*.json`

        ],
        "platforms": {
            "web": {
                "transformGroup": "web",
                "buildPath": "dist/web/",
                "transforms": ["attribute/cti", "size/px", "name/cti/kebab", "color/rgb", "color/css"],
                "files": [{
                    "destination": "tokens.css",
                    "format": "css/variables",
                    "selector": ":root"
                }]
            },

            "json": {
                "transformGroup": "css",
                "buildPath": "dist/json/",
                "files": [
                    {
                        "destination": "tokens.json",
                        "format": "json/flat"
                    }]
            },

            "android": {
                "transformGroup": "android",
                "buildPath": "dist/android/",
                "transforms": ["attribute/cti", "name/cti/snake", "color/hex8android", "size/pxToDpOrSp"],
                "files": [{
                    "destination": "tokens.colors.xml",
                    "format": "android/colors"
                }, {
                    "destination": "tokens.spacing.xml",
                    "format": "android/resources",
                    "resourceType": "dimen",
                    "filter": {
                        "attributes": {
                            "category": "spacing"
                        },
                    },

                },
                {
                    "destination": "tokens.size.xml",
                    "format": "android/resources",
                    "resourceType": "dimen",
                    "filter": {
                        "attributes": {
                            "category": "size"
                        },
                    },

                }, {
                    "destination": "tokens.border.xml",
                    "format": "android/resources",
                    "resourceType": "dimen",
                    "filter": {
                        "attributes": {
                            "category": "border"
                        },
                    },

                }, {
                    "destination": "tokens.opacity.xml",
                    "format": "android/resources",
                    "resourceType": "dimen",
                    "filter": {
                        "attributes": {
                            "category": "opacity"
                        },
                    },

                }, {
                    "destination": "tokens.font-size.xml",
                    "format": "android/resources",
                    "resourceType": "dimen",
                    "filter": {
                        "attributes": {
                            "category": "font-size"
                        },
                    },

                }]
            },
            "ios": {
                "transformGroup": "ios",
                "buildPath": "dist/ios/",
                "transforms": ["attribute/cti", "name/cti/pascal", "color/UIColor", "content/objC/literal", "asset/objC/literal", "size/pxTopt", "font/objC/literal"],
                "files": [
                    {
                        "destination": "VDSDesignTokensColor.h",
                        "format": "ios/colors.h",
                        "className": "VDSDesignTokensColor",
                        "type": "VDSDesignTokensColorName",
                        "filter": {
                            "attributes": {
                                "category": "color"
                            }
                        }
                    },
                    {
                        "destination": "VDSDesignTokensColor.m",
                        "format": "ios/colors.m",
                        "className": "VDSDesignTokensColor",
                        "type": "VDSDesignTokensColorName",
                        "filter": {
                            "attributes": {
                                "category": "color"
                            }
                        }
                    }
                ]
            },
            "ios-swift": {
                "transformGroup": "ios-swift",
                "buildPath": "dist/ios-swift/",
                "transforms": ["attribute/cti", "name/cti/pascal", "color/UIColor", "content/objC/literal", "asset/objC/literal", "size/pxTopt", "font/objC/literal"],

                "files": [
                    {
                        "destination": "VDSDesignTokens.swift",
                        "format": "ios-swift/class.swift",
                        "className": "VDSDesignTokens",
                        "filter": {}
                    }
                ]
            },
            "ios-swift-separate-enums": {
                "transformGroup": "ios-swift-separate",
                "buildPath": `dist/ios-swift/`,
                "transforms": ["attribute/cti", "name/cti/pascal", "color/UIColor", "content/objC/literal", "asset/objC/literal", "size/pxTopt", "font/objC/literal"],
                "files": [
                    {
                        "destination": "VDSDesignTokensColor.swift",
                        "format": "ios-swift/enum.swift",
                        "className": "VDSDesignTokensColor",
                        "filter": {
                            "attributes": {
                                "category": "color"
                            }
                        }
                    }
                ]
            },
            "react-native": {
                "transformGroup": "react-native",
                "buildPath": "dist/reactNative/",
                "transforms": ["name/cti/camel", "size/object", "color/css"],
                "files": [{
                    "destination": "tokens.js",
                    "format": "javascript/module"
                }]
            }


        }
    };
}



//Transforms dimensions to px

function transformDimension(value) {
    if (value.endsWith('px')) {
        return value;
    }
    return value + 'px';
}
// Transform fontSizes to px
StyleDictionaryPackage.registerTransform({
    name: 'size/px',
    type: 'value',
    transitive: true,
    matcher: token => ['fontSizes', 'dimension', 'borderRadius', 'borderWidth', 'spacing', 'sizing'].includes(token.type),
    transformer: token => transformDimension(token.value),
});

// Custom transform to convert px to dp/sp for android
StyleDictionaryPackage.registerTransform({
    name: 'size/pxToDpOrSp',
    type: 'value',
    matcher(prop) {
        return prop.value.match(/^-?[\d.]+px$/);
    },
    transformer(prop) {
        return prop.name.includes('font')
            ? prop.value.replace(/px$/, 'sp')
            : prop.value.replace(/px$/, 'dp');
    },
});

// Custom transform to convert px to pt for iOS
StyleDictionaryPackage.registerTransform({
    name: 'size/pxTopt',
    type: 'value',
    matcher: (prop) => {
        return prop.value.match(/^-?[\d.]+px$/);
    },
    transformer: (prop) => {
        return prop.value.replace(/px$/, 'pt');
    },
});


console.log('Build started...');

['web', 'json', 'ios', 'ios-swift', 'ios-swift-separate-enums', 'android', 'react-native'].forEach(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(platform));

    StyleDictionary.buildPlatform(platform);

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');