# Patch and Update Document Handler

This TypeScript project contains a utility function `patchAndUpdateDocumentHandler` designed to perform targeted updates on a nested document structure based on a specific update payload.

## Technical Specifications

**TypeScript Version**: [5.2.2]
**Node.js Version**: [v18.13.0]
**Dependencies**:
    -  "@types/jest": "^29.5.6",
    -  "jest": "^29.7.0",
    -  "ts-jest": "^29.1.1",
    -  "typescript": "^5.2.2"


## Overview
The `patchAndUpdateDocumentHandler` function takes two arguments:

- `document`: The original document object that you want to update.
- `update`: The updates you want to apply to the document.

The function uses dot-notation paths with support for array indexing to determine where updates should be applied within the nested document structure. The function can handle updates on nested arrays and objects, including handling non-existent properties by adding them to the document.


## Structure
The project defines multiple TypeScript interfaces to type-check the document and the update payload:

- `MyDocument`: A generic interface with index signature to accommodate dynamic properties.
- `Item`: Represents the structure of objects within an array named 'b'.
- `AStructure`: Represents the structure for the 'a' property in the document.
- `Images`: Represents the structure for image URLs with different sizes.
- `MyDocumentInterface`: Represents the complete structure of the document with optional properties.


## Getting Started
Before you can use or contribute to the project, make sure you have [Node.js](https://nodejs.org/en/) and npm (which comes with Node.js) installed. You will also need TypeScript globally installed or as a dev dependency in your project.

git clone https://github.com/Merci4dev/patchAndUpdateDocumentHandler.git


## Installation
bash / zsh

1. Install TypeScript globally (if you haven't already):
    npm install -g typescript
2. Install the project dependencies
   npm install 
3. cd challenge (to execute the compiler)
    tsc 
4. To escutre the js code navegate to:
   cd dist/src/
5. Run the js code
    node patch_and_update_document_handler.js

Note: if you want the to see the output uncomente the .log at the line 121 at the .ts file


## Features
Update nested documents using a simple key-value update payload.
Support for array element updates using unique identifiers.
Capability to add new properties dynamically if they do not exist in the original document.


## Error Handling
The function will log an error message to the console when encountering the following scenarios:

Attempting to update an array element that does not exist.
Providing a non-array value when an array is expected.


## Contributing
Contributions to this project are welcome. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes.
4. Write unit tests to ensure the functionality works as expected.
5. Create a pull request against the main branch.


## License
This project is licensed under the MIT License.


## Contact
For any queries or further assistance, please contact:
`[Elier Mercedes]`, and `merci4dev@gmail.com` 