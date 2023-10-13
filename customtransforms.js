// @flow strict
const StyleDictionary = require('style-dictionary');


const { fileHeader } = StyleDictionary.formatHelpers;

StyleDictionary.registerFileHeader({
    name: 'flowCustomHeader',
    // defaultMessage contains the 2 lines that appear in the default file header
    fileHeader: (defaultMessage) => [`@flow strict`, ...defaultMessage],
});


StyleDictionary.registerTransform({
    name: 'size/android/pxToDpOrSp',
    type: 'value',
    matcher(prop) {
        return prop.value.match(/^-?[\d.]+px$/);
    },
    transformer(prop) {
        const numericalValue = parseFloat(prop.value.replace(/px$/, '')); // Convert "16px" to 16
        return prop.name.includes('font')
            ? `${numericalValue}.0sp`
            : `${numericalValue}.0dp`;
    },
});




StyleDictionary.registerTransform({
    name: 'size/pxToCGFloat',
    type: 'value',
    matcher: (prop) => {
        return prop.value.match(/^-?[\d.]+px$/);
    },
    transformer: (prop) => {
        return parseFloat(prop.value).toString();
    },
});


StyleDictionary.registerTransform({
    name: 'custom/size/stripUnit',
    type: 'value',
    transitive: true,
    matcher: (token) => /\d+(px|rem|sp|em)$/.test(token.original.value),
    transformer: (token) => token.original.value.replace(/px|rem|sp|em/, ''),
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
function addFlowTypes(dictionaryTokens) {
    return `// @flow strict\n/* This file is automatically generated by style-dictionary*/\n\ndeclare module.exports: {|\n${dictionaryTokens
        .map((token) => `  +"${token.name}": ${JSON.stringify(token.value)}`)
        .join(',\n')}\n|}`;
}

function jsonFlatFlow() {
    // $FlowFixMe[missing-local-annot]
    return ({ dictionary }) => addFlowTypes(dictionary.allTokens);
}

StyleDictionary.registerFormat({
    name: 'jsonFlatFlow',
    formatter: jsonFlatFlow(),
});