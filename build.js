const fs = require('fs');
const path = require('path');
const StyleDictionaryPackage = require('style-dictionary');
const getStyleDictionaryConfig = require('./platformconfig.js');


// Import the custom transforms and configurations
require('./customtransforms.js');

console.log('Build started...');

// Dynamically fetch theme names based on tokens/themes/*.json
const themeFiles = fs.readdirSync(path.join(__dirname, 'tokens/themes'));
const themeNames = themeFiles.map(file => path.basename(file, '.json'));



// Generate a configuration for each theme and platform combination
const platformConfigurations = {};


// PROCESS THE DESIGN TOKENS FOR EACH THEME AND PLATFORM
themeNames.forEach(function (theme) {
    ['web', 'json'].forEach(function (platform) {

        console.log('\n==============================================');
        console.log(`\nProcessing: [${platform}] [${theme}]`);

        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, platform));

        StyleDictionary.buildPlatform(platform);

        console.log('\nEnd processing');

    })
})

console.log('\n==============================================');
console.log('\nBuild completed!');
