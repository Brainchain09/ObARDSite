import formidable from "formidable";
import fs from "fs";
import Papa from 'papaparse'
import {insertData} from "../../utilities/pushers";
import rdfStore from "rdfstore"
import {getGraph} from "../../utilities/fetchers";

export const config = {
    api: {
        bodyParser: false
    }
};

const post = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields)
        await parseFile(files.file, fields.date.split(","), fields.criterion);
        return res.status(201).send("");
    });
};

const parseFile = async (file, date, criterion) => {
    const data = fs.readFileSync(file.filepath, "utf-8");
    console.log(data)
    let csv_json = Papa.parse(data, {encoding :'utf-8'})
    console.log(csv_json.data);
    for (let row of csv_json.data){
        await insertData(row, date, criterion)
        console.log("Coucou")
    }
    return ;
};

export default (req, res) => {
    req.method === "POST"
        ? post(req, res)
        : req.method === "PUT"
        ? console.log("PUT")
        : req.method === "DELETE"
            ? console.log("DELETE")
            : req.method === "GET"
                ? console.log("GET")
                : res.status(404).send("");
};
