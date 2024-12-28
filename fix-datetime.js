const fs = require('fs');
const Papa = require('papaparse');
const moment = require('moment');

const readCSV = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    return Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
    }).data;
};

const updateCreatedTimeFormat = (data) => {
    return data.map(row => {
        if (row.created_at) {
            row.created_at = moment(row.created_at).format('YYYY-MM-DD HH:mm:ss');
        }
        return row;
    });
};

const writeCSV = (data, outputFilePath) => {
    const csv = Papa.unparse(data);
    fs.writeFileSync(outputFilePath, csv, 'utf8');
    console.log(`Updated CSV saved to ${outputFilePath}`);
};

const inputFile = 'datasets/ppn12_datasets.csv';
const outputFile = 'datasets/ppn12_datasets1.csv';

const csvData = readCSV(inputFile);
const updatedData = updateCreatedTimeFormat(csvData);
writeCSV(updatedData, outputFile);
