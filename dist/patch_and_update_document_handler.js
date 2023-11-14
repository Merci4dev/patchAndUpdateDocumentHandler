"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchAndUpdateDocumentHandler = void 0;
// Export a function that takes two MyDocument type objects as arguments and returns an updated MyDocument.
const patchAndUpdateDocumentHandler = (document, update) => {
    // Iterate over all keys in the 'update' object.
    Object.keys(update).forEach((key) => {
        const path = key.split('.');
        // Begin at the root of the 'document' and cast it to any type temporarily.
        let currentPart = document;
        // Iterate through the parts of the path.
        for (let i = 0; i < path.length; i++) {
            const isLast = i === path.length - 1;
            const match = path[i].match(/^(.+?)\[(.*)\]$/);
            // If the current path segment does reference an array and index...
            if (match) {
                const arrayName = match[1];
                const itemId = match[2];
                //Create a new array if it does not exist.
                if (!currentPart[arrayName] && isLast) {
                    currentPart[arrayName] = [];
                }
                // If the property is not an array, convert it to an array with the update element.
                if (!Array.isArray(currentPart[arrayName])) {
                    if (isLast) {
                        currentPart[arrayName] = [Object.assign({ _id: itemId }, update[key])];
                        return;
                    }
                    else {
                        console.error(`${arrayName} is not an array.`);
                        return;
                    }
                }
                // Find the index of the element in the array.
                let itemIndex = currentPart[arrayName].findIndex((item) => (item === null || item === void 0 ? void 0 : item._id) === itemId);
                // If it is the last element of the path...
                if (isLast) {
                    // Delete or update the element from the array.
                    if (update[key] === null) {
                        if (itemIndex !== -1)
                            currentPart[arrayName].splice(itemIndex, 1);
                    }
                    else {
                        // Make sure the value is an object with a '_id' field for arrays of objects.
                        let updateValue = typeof update[key] === 'object' ? Object.assign({ _id: itemId }, update[key]) : update[key];
                        if (itemIndex === -1) {
                            currentPart[arrayName].push(updateValue);
                        }
                        else {
                            currentPart[arrayName][itemIndex] = updateValue;
                        }
                    }
                }
                else {
                    if (itemIndex === -1) {
                        currentPart[arrayName].push({ _id: itemId });
                        itemIndex = currentPart[arrayName].length - 1;
                    }
                    currentPart = currentPart[arrayName][itemIndex];
                }
            }
            else {
                // If the current segment is not a reference to an array...
                if (isLast) {
                    // Delete or update the value.
                    if (update[key] === null) {
                        delete currentPart[path[i]];
                    }
                    else {
                        currentPart[path[i]] = update[key];
                    }
                }
                else {
                    // Prepare the next level of the object.
                    if (!currentPart[path[i]]) {
                        currentPart[path[i]] = {};
                    }
                    currentPart = currentPart[path[i]];
                }
            }
        }
    });
    console.log(JSON.stringify(document, null, 2));
    return document;
};
exports.patchAndUpdateDocumentHandler = patchAndUpdateDocumentHandler;
// Test Object Definitions
const objBase = {
    a: {
        b: [
            { _id: '5dc0ad700000000000000000', name: 'asdf1' },
            { _id: '5dc0ad700000000000000001', name: 'asdf2' },
            { _id: '5dc0ad700000000000000002', name: 'asdf3' }
        ]
    },
    value: 'hui'
};
const objWithImages = Object.assign(Object.assign({}, objBase), { images: {
        thumbnail: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        small: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        medium: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        large: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        xlarge: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg'
    } });
const objEmptyB = {
    b: []
};
// Update Definitions
const updateTitleInB = {
    'b[5dc0ad700000000000000000]': { title: 'asdf1-update' }
};
const update = {
    "a.b[5dc0ad700000000000000000]": { "title": "asdf1-updated" },
    // "a.b[5dc0ad700000000000000000].titleValue": "asdf1-updated",
    // "a.b[]": { "_id": "5dc0ad700000000000000003", "name": "co2" },
    // "a.b[5dc0ad700000000000000001]": null,
    // "a.c": "hallo",
    // "a.c": "hallo-changed",
    // "value": null,
    // "a.b": null, 
    // "value": null,
    // "something": "anything",
    // "a.c": "hallo",
    // "x[]": "asdfX",
    // "v.x[]": "asdfV",
    // "v.m.l": "asdf-val",
    // "images": {
    //   	"thumbnail": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    //   	"small": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    //   	"medium": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    //   	"large": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    //   	"xlarge": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg"
    //   }
};
// Update Function Executions
(0, exports.patchAndUpdateDocumentHandler)(objBase, update);
// patchAndUpdateDocumentHandler(objBase, updateTitleInB);
// patchAndUpdateDocumentHandler(objEmptyB, updateTitleInB);
// Extra
// patchAndUpdateDocumentHandler(objWithImages, updateTitleInB);
