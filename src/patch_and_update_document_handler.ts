interface MyDocument {
  [key: string]: any;
}
  
// We define an interface to represent the structure of the internal objects of array 'b'.
export interface Item {
  _id: string;
  name?: string;
  title?: string;
}
  
// We define an interface to represent the structure of 'a'.
interface AStructure {
  b: Item[];
  c?: string;
}

// We define an interface for the 'images' property.
interface Images {
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  xlarge?: string;
}

// We define an interface to represent the complete structure of our document.
export interface MyDocumentInterface {
  a?: AStructure;
  value?: string | null;
  images?: Images;
  something?: string;
  [key: string]: any; 
}

// Export a function that takes two MyDocument type objects as arguments and returns an updated MyDocument.
export const patchAndUpdateDocumentHandler = (document: MyDocument, update: MyDocument): MyDocument => {
  // Iterate over all keys in the 'update' object.
  Object.keys(update).forEach((key) => {
    const path = key.split('.');
    
    // Begin at the root of the 'document' and cast it to any type temporarily.
    let currentPart: any = document; 

    // Iterate through the parts of the path.
    for (let i = 0; i < path.length; i++) {
      const isLast = i === path.length - 1;
      const match = path[i].match(/^(.+?)\[(.*)\]$/);
      
      // If the current path segment does reference an array and index...
      if (match) {
        const arrayName = match[1];
        const itemId = match[2];
        
        // If the current part is not an array as expected...
        if (!Array.isArray(currentPart[arrayName])) {
          if (isLast && update[key] !== null) {
            currentPart[arrayName] = [update[key]];
            return;
          }
          console.error(`${arrayName} is not an array.`);
          return;
        }
        
        // If we have an item ID...
        if (itemId) {
          // Find the index of the item in the array.
          const itemIndex = currentPart[arrayName].findIndex((item: any) => item._id === itemId);

          // If the item isn't found and it's not the last path element, push a new item with the ID.
          if (itemIndex === -1) {
            if (isLast) {
              console.error(`Item with _id ${itemId} not found.`);
              return;
            }
            currentPart[arrayName].push({ _id: itemId });
          }
          
          // If we're at the last path element...
          if (isLast) {

            // If the update is null, remove the item from the array.
            if (update[key] === null) {
              currentPart[arrayName].splice(itemIndex, 1);
            } else {
              // Otherwise, update the item with the new data.
              currentPart[arrayName][itemIndex] = { _id: itemId, ...update[key] };
            }
          } else {
            // Move deeper into the document structure for the next iteration.
            currentPart = currentPart[arrayName][itemIndex];
          }
        } else {
          // If there's no item ID and we're at the end, push the update into the array.
          if (isLast) {
            currentPart[arrayName].push(update[key]);
          } else {
            return;
          }
        }
      } else {
          // If the current path segment is not an array reference...
        if (isLast) {
          if (update[key] === null) {
            delete currentPart[path[i]];
          } else {
            currentPart[path[i]] = update[key];
          }
        } else {
            // If the property doesn't exist, create an empty object for the next iteration.
          if (!currentPart[path[i]]) {
            currentPart[path[i]] = {};
          }
          // Move deeper into the document structure for the next iteration.
          currentPart = currentPart[path[i]];
        }
      }
    }
  });

  // console.log(JSON.stringify(document, null, 2));

  return document;
}

// Ejemplo de uso con los objetos definidos.
const obj: MyDocumentInterface = {
  a: {
    b: [
      { _id: '5dc0ad700000000000000000', name: 'asdf1' },
      { _id: '5dc0ad700000000000000001', name: 'asdf2' },
      { _id: '5dc0ad700000000000000002', name: 'asdf3' }
    ]
  },
  value: 'hui'
};

const objTow: MyDocumentInterface = {
  a: {
    b: [
      { _id: '5dc0ad700000000000000000', name: 'asdf1' },
      { _id: '5dc0ad700000000000000001', name: 'asdf2' },
      { _id: '5dc0ad700000000000000002', name: 'asdf3' }
    ]
  },
  value: 'hui',
  images: {
        thumbnail: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        small: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        medium: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        large: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        xlarge: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg'
    }
};

const update: MyDocumentInterface = {

  "a.b[5dc0ad700000000000000000]": { "title": "asdf1-updated" },

  // "a.b[5dc0ad700000000000000000].titleValue": "asdf1-updated",

  // "a.b[]": { "_id": "5dc0ad700000000000000003", "name": "co2" },

  // "a.b[5dc0ad700000000000000001]": null,

  // "a.c": "hallo",

  // "a.c": "hallo-changed",

  // "value": null,

  // "a.b": null

  // "value": null,
    // "something": "anything",
    // "a.c": "hallo",

  // "x[]": "asdfX",
    // "v.x[]": "asdfV",
    // "v.m.l": "asdf-val",

  // "images": {
    // 	"thumbnail": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    // 	"small": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    // 	"medium": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    // 	"large": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
    // 	"xlarge": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg"
    // }

};

patchAndUpdateDocumentHandler(obj, update);


