// @flow strict
const StyleDictionary = require('style-dictionary');

const { fileHeader } = StyleDictionary.formatHelpers;

StyleDictionary.registerFileHeader({
    name: 'flowCustomHeader',
    // defaultMessage contains the 2 lines that appear in the default file header
    fileHeader: (defaultMessage) => [`@flow strict`, ...defaultMessage],
});

StyleDictionary.registerTransform({
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

StyleDictionary.registerFormat({
    name: 'customJSArrayFormat',
    formatter: ({ dictionary, file }) => {
        const tokenArray = dictionary.allTokens.map((token) =>
            JSON.stringify({
                name: token.path.join('-'),
                value: token.value,
                darkValue: token.darkValue,
                comment: token.comment,
                category: token.attributes.category,
            }),
        );
        return `${fileHeader({ file, commentStyle: 'short' })} module.exports = [${tokenArray}]`;
    },
});

StyleDictionary.registerFormat({
    name: 'customJSIndividualFormat',
    formatter: ({ dictionary }) =>
        `// @flow strict\n\n${StyleDictionary.format['javascript/es6']({
            dictionary,
        })}`,
});

// $FlowFixMe[missing-local-annot]
function darkFormat(dictionary) {
    return dictionary.allTokens.map((token) => {
        const { darkValue } = token;
        if (darkValue) {
            return { ...token, value: token.darkValue };
        }
        return token;
    });
}

function darkFormatWrapper(format /*: string */) {
    // $FlowFixMe[missing-local-annot]
    return (args) => {
        const dictionary = { ...args.dictionary };
        // Override each token's `value` with `darkValue`
        dictionary.allTokens = darkFormat(dictionary);
        // Use the built-in format but with our customized dictionary object
        // so it will output the darkValue instead of the value
        return StyleDictionary.format[format]({
            ...args,
            dictionary,
        });
    };
}

// $FlowFixMe[missing-local-annot]
function addFlowTypes(dictionaryTokens) {
    return `// @flow strict\n/* This file is automatically generated by style-dictionary*/\n\ndeclare module.exports: {|\n${dictionaryTokens
        .map((token) => `  +"${token.name}": ${JSON.stringify(token.value)}`)
        .join(',\n')}\n|}`;
}

function jsonFlatFlow() {
    // $FlowFixMe[missing-local-annot]
    return ({ dictionary }) => addFlowTypes(dictionary.allTokens);
}
function cssDarkJsonFlatFlow() {
    // $FlowFixMe[missing-local-annot]
    return ({ dictionary }) => addFlowTypes(darkFormat(dictionary));
}

StyleDictionary.registerFormat({
    name: 'jsonFlatFlow',
    formatter: jsonFlatFlow(),
});
StyleDictionary.extend('config.json').buildAllPlatforms();