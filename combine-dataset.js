const fs = require('fs');
const Papa = require('papaparse');

const readCSV = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    return Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
    }).data;
};

const mergeCSV = (filePaths, outputFilePath) => {
    let mergedData = [];

    filePaths.forEach((filePath, index) => {
        const data = readCSV(filePath);
        if (index === 0) {
            mergedData.push(...data);
        } else {
            mergedData.push(...data.slice(1));
        }
    });

    const csv = Papa.unparse(mergedData);
    fs.writeFileSync(outputFilePath, csv, 'utf8');
    console.log(`Merged CSV saved to ${outputFilePath}`);
};

const inputFiles = [
    'tweets-data/ppn12_dataset1.csv',
    'tweets-data/ppn12_dataset2.csv',
    'tweets-data/ppn12_dataset3.csv',
    'tweets-data/ppn12_dataset4.csv',
    'tweets-data/ppn12_dataset5.csv',
    'tweets-data/ppn12_dataset6.csv',
    'tweets-data/ppn12_dataset7.csv',
    'tweets-data/ppn12_dataset8.csv'
];
const outputFile = 'datasets/ppn12_datasets.csv';

mergeCSV(inputFiles, outputFile);
