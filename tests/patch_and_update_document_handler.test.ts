

import { patchAndUpdateDocumentHandler, MyDocumentInterface, Item } from "../src/patch_and_update_document_handler";

// Help function to initialize the document
function initializeDocument(): MyDocumentInterface {
  return {
    a: {
      b: [
        { _id: '5dc0ad700000000000000000', name: 'asdf1' },
        { _id: '5dc0ad700000000000000001', name: 'asdf2' },
        { _id: '5dc0ad700000000000000002', name: 'asdf3' }
      ]
    },
    value: "hui",
  };
}

describe('patchAndUpdateDocumentHandler', () => {

  let document: MyDocumentInterface;

  // Initial setup for each test
  beforeEach(() => {
    document = initializeDocument();
  });

  it('should update the value of an existing field', () => {
      const originalDoc = { value: 'original' };
      const update = { value: 'updated' };
      const updatedDoc = patchAndUpdateDocumentHandler(originalDoc, update);
      expect(updatedDoc.value).toBe('updated');
  });

  it('add array object on non existing ROOT', () => {
 
    const userUpdate = { 'b[5dc0ad700000000000000000]': { title: 'asdf1-update' } };

    const expectedOutput = {
    ...document,
      b: [{ _id: '5dc0ad700000000000000000', title: 'asdf1-update' }],
      value: 'hui'
    };

    const result = patchAndUpdateDocumentHandler(document, userUpdate);

    // expect(result).toEqual(expectedOutput);

    //Making Individual checks
    expect(result.a).toEqual(document.a); // Check the 'a' property
    expect(result.value).toEqual('hui'); // Check the 'value' property
    expect(result.b).toEqual([{ _id: '5dc0ad700000000000000000', title: 'asdf1-update' }]); // Check the 'b' property
  });
  
  it('add array object on existing ROOT', () => {
    const obj: MyDocumentInterface = {
      b: []
    };

    const userUpdate = { 'b[5dc0ad700000000000000000]': { title: 'asdf1-update' } };

    const expectedOutput = {
      b: [{ _id: '5dc0ad700000000000000000', title: 'asdf1-update' }]
    };

    const result = patchAndUpdateDocumentHandler(obj, userUpdate);

    expect(result).toEqual(expectedOutput);
  })

  it('should handle non-array when expecting an array', () => {
    const originalDocument = { a: { b: 'not an array' } };
    const update = { 'a.b[123]': { name: 'updated name' } };
  
    const result = patchAndUpdateDocumentHandler(originalDocument, update);
  
    // Expect that the document has now created an array 'b' with the update included.
    expect(Array.isArray(result.a.b)).toBe(true);
    expect(result.a.b[0]).toEqual({ _id: '123', name: 'updated name' });
  });

  it('should add a new item when no array index is specified', () => {
    const originalDocument = { a: { b: [] } };
    const update = { 'a.b[]': { _id: '2', name: 'new item' } };
  
    const result = patchAndUpdateDocumentHandler(originalDocument, update);
  
    // Expect that a new item is added to the array 'b'.
    expect(result.a.b.length).toBe(1);
    expect(result.a.b[0]).toEqual({ _id: '2', name: 'new item' });
  });

  it('should apply an update to change array value by _id', () => {
    // The update to be applied
    const update = {
      "a.b[5dc0ad700000000000000000].titleValue": "asdf1-updated"
    };
  
    // Apply the update
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);
  
    // Verify the update was applied correctly
    expect(updatedDocument).toBeDefined();
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a?.b).toBeDefined();
    expect(updatedDocument.a?.b[0]._id).toBe('5dc0ad700000000000000000');
    expect(updatedDocument.a?.b[0].titleValue).toBe('asdf1-updated');
    expect(updatedDocument.a?.b[0].name).toBe('asdf1'); // Make sure other values remain the same
    expect(updatedDocument.value).toBe('hui'); // Make sure other properties are not affected
  });

  it('should add a new entry to an array', () => {
    // The update to be applied
    const update = {
      "a.b[]": { "_id": "5dc0ad700000000000000003", "name": "co2" }
    };

    // Apply the update
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);

    // Verify the update was applied correctly
    expect(updatedDocument).toBeDefined();
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a?.b).toBeDefined();
    const newItemIndex = updatedDocument.a?.b.findIndex((item: Item) => item._id === '5dc0ad700000000000000003');
    expect(newItemIndex).toBeGreaterThan(-1); // New item should exist
    const newItem = updatedDocument.a?.b[newItemIndex as number];
    expect(newItem).toBeDefined();
    expect(newItem?._id).toBe('5dc0ad700000000000000003');
    expect(newItem?.name).toBe('co2'); // Verify new item's name
    expect(updatedDocument.value).toBe('hui'); // Make sure other properties are not affected
  });

  it('should remove an array entry by _id', () => {
    // Update instruction to remove the array entry
    const update = {
      "a.b[5dc0ad700000000000000001]": null
    };
  
    // Apply the update to the document
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);
  
    // Assert that the updatedDocument is defined
    expect(updatedDocument).toBeDefined();
  
    // Assert that the property 'a' and the array 'b' are defined
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a?.b).toBeDefined();
  
    // Assert that the entry with _id '5dc0ad700000000000000001' is no longer in the array
    const removedItemIndex = updatedDocument.a?.b.findIndex((item:Item) => item._id === '5dc0ad700000000000000001');
    expect(removedItemIndex).toBe(-1); // Entry should not be found
  
    // Verify the length of the array to ensure an entry was removed
    expect(updatedDocument.a?.b.length).toBe(2);
  
    // Check that the remaining entries are as expected
    expect(updatedDocument.a?.b[0]._id).toBe('5dc0ad700000000000000000');
    expect(updatedDocument.a?.b[1]._id).toBe('5dc0ad700000000000000002');
    expect(updatedDocument.value).toBe('hui'); // Verify that the value property is still 'hui'
  });
  
  it('should add a regular object value', () => {
    // Update instruction to add the object value
    const update = {
      'a.c': 'hallo'
    };
  
    // Apply the update to the document
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);
  
    // Assert that the updatedDocument is defined
    expect(updatedDocument).toBeDefined();
  
    // Assert that the property 'a' and the new property 'c' are defined
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a?.c).toBeDefined();
  
    // Assert that the value of property 'c' is 'hallo'
    expect(updatedDocument.a?.c).toBe('hallo');
  
    // Verify that the array 'b' is still intact
    expect(updatedDocument.a?.b.length).toBe(3);
    expect(updatedDocument.a?.b[0].name).toBe('asdf1');
    expect(updatedDocument.a?.b[1].name).toBe('asdf2');
    expect(updatedDocument.a?.b[2].name).toBe('asdf3');
  
    // Verify that the 'value' property is still 'hui'
    expect(updatedDocument.value).toBe('hui');
  });

  it('should update a regular object value', () => {
    // Update instruction to change the object value
    const update = {
      'a.c': 'hallo-changed'
    };
  
    // Apply the update to the document
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);
  
    // Assert that the updatedDocument is defined
    expect(updatedDocument).toBeDefined();
  
    // Assert that the property 'a' and the updated property 'c' are defined
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a?.c).toBeDefined();
  
    // Assert that the value of property 'c' is 'hallo-changed'
    expect(updatedDocument.a?.c).toBe('hallo-changed');
  
    // Verify that the array 'b' is still intact
    expect(updatedDocument.a?.b.length).toBe(3);
    expect(updatedDocument.a?.b[0].name).toBe('asdf1');
    expect(updatedDocument.a?.b[1].name).toBe('asdf2');
    expect(updatedDocument.a?.b[2].name).toBe('asdf3');
  
    // Verify that the 'value' property is still 'hui'
    expect(updatedDocument.value).toBe('hui');
  });

  it('should unset a regular object value on root level', () => {
    // Update instruction to unset the 'value' property
    const update = {
      'value': null
    };
  
    // Apply the update to the document
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);
  
    // Assert that the updatedDocument is defined
    expect(updatedDocument).toBeDefined();
  
    // Assert that the 'value' property has been removed
    expect(updatedDocument.value).toBeUndefined();
  
    // Verify that the array 'b' and the rest of object 'a' are still intact
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a?.b.length).toBe(3);
    expect(updatedDocument.a?.b[0]._id).toBe('5dc0ad700000000000000000');
    expect(updatedDocument.a?.b[1]._id).toBe('5dc0ad700000000000000001');
    expect(updatedDocument.a?.b[2]._id).toBe('5dc0ad700000000000000002');
  });
  
  it('should unset a nested object value', () => {
    // Update instruction to unset the 'a.b' property
    const update = {
      'a.b': null
    };

    // Apply the update to the document
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);

    // Assert that the updatedDocument is defined
    expect(updatedDocument).toBeDefined();

    // Assert that the 'a.b' property has been removed
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a.b).toBeUndefined();

    // Verify that the 'value' property on the root level is still intact
    expect(updatedDocument.value).toBe('hui');
  });

  it('should apply multiple update operations at once', () => {
    // Update instruction for multiple operations
    const update = {
      "value": null,
      "something": "anything",
      "a.c": "hallo"
    };
  
    // Apply the update to the document
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);
  
    // Assert that the updatedDocument is defined
    expect(updatedDocument).toBeDefined();
  
    // Assert that the 'value' property has been removed
    expect(updatedDocument.value).toBeUndefined();
  
    // Assert that the 'something' property has been updated
    expect(updatedDocument.something).toBe('anything');
  
    // Assert that the 'a.c' property has been set
    expect(updatedDocument.a).toBeDefined();
    expect(updatedDocument.a.c).toBe('hallo');
  
    // Assert that the 'a.b' array is unchanged
    expect(updatedDocument.a.b.length).toBe(3);
    expect(updatedDocument.a.b[0]._id).toBe('5dc0ad700000000000000000');
    expect(updatedDocument.a.b[1]._id).toBe('5dc0ad700000000000000001');
    expect(updatedDocument.a.b[2]._id).toBe('5dc0ad700000000000000002');
  });

  it('should apply array updates and create underlying array or object', () => {
    // Update instruction for creating arrays and objects
    const update = {
      "x[]": "asdfX",
      "v.x[]": "asdfV",
      "v.m.l": "asdf-val"
    };

    // Apply the update to the document
    const updatedDocument = patchAndUpdateDocumentHandler(document, update);

    // Assert that the updatedDocument is defined
    expect(updatedDocument).toBeDefined();

    // Assert that 'x' array has been created and the value has been added
    expect(updatedDocument.x).toEqual(['asdfX']);

    // Assert that 'v' object and 'v.x' array have been created, and 'v.x' has the value
    expect(updatedDocument.v).toBeDefined();
    expect(updatedDocument.v.x).toEqual(['asdfV']);

    // Assert that 'v.m' object has been created and 'v.m.l' has been set
    expect(updatedDocument.v.m).toBeDefined();
    expect(updatedDocument.v.m.l).toBe('asdf-val');

    // Assert that 'a.b' array and 'value' remain unchanged
    expect(updatedDocument.a.b.length).toBe(3);
    expect(updatedDocument.value).toBe('hui');
  });

  it('should apply user image update', () => {
    // Initial document structure for this case
    const obj = {
      ...document,
      images: {
        thumbnail: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        small: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        medium: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        large: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
        xlarge: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg'
      }
    };

    // Update instruction for updating images
    const update = {
      images: {
        thumbnail: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        small: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        medium: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        large: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        xlarge: 'http://files-it.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg'
      }
    };

    // Apply the update to the document
    const updatedObj = patchAndUpdateDocumentHandler(document, update);

    // Assert that the updatedObj's images are updated correctly
    expect(updatedObj.images.thumbnail).toBe(update.images.thumbnail);
    expect(updatedObj.images.small).toBe(update.images.small);
    expect(updatedObj.images.medium).toBe(update.images.medium);
    expect(updatedObj.images.large).toBe(update.images.large);
    expect(updatedObj.images.xlarge).toBe(update.images.xlarge);

    expect(updatedObj.a?.b.length).toBe(3);
    expect(updatedObj.a?.b).toEqual(document.a?.b); // Ensuring the 'a.b' array is unchanged
    expect(updatedObj.value).toBe('hui');
  });

  it('should correctly update title in object with images', () => {
    const objWithImages = {
      ...document,
      images: {
        thumbnail: 'http://example.com/thumbnail.jpg',
        small: 'http://example.com/small.jpg',
        medium: 'http://example.com/medium.jpg',
        large: 'http://example.com/large.jpg',
        xlarge: 'http://example.com/xlarge.jpg'
      }
    };

    const updateTitleInB: MyDocumentInterface = {
      'b[5dc0ad700000000000000000]': { title: 'asdf1-update' }
    };

    const expectedOutput = {
      ...objWithImages,
      b: [{ _id: '5dc0ad700000000000000000', title: 'asdf1-update' }]
    };

    const updatedDocument = patchAndUpdateDocumentHandler(objWithImages, updateTitleInB);

    expect(updatedDocument).toEqual(expectedOutput);
  });

})