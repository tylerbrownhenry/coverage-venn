export let generateFromTemplate: jest.Mock<{
    templatePath: any;
    outputPath: any;
    replacements: any;
    success: boolean;
}, [templatePath?: any, outputPath?: any, replacements?: any], any>;
export let listTemplates: jest.Mock<string[], [], any>;
export let validateTemplate: jest.Mock<{
    isValid: any;
    errors: never[];
}, [templateContent?: any], any>;
