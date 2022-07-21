import Client from 'sparql-http-client'
const ParsingClient = require('sparql-http-client/ParsingClient')
import {
    isIdInDatabase,
    versionsOf,
    getVersionState,
    getUpperUnit,
    getURI,
    getId,
    getVersion,
    getNewId
} from "./fetchers";


const hasVersion="http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#hasVersion"
const idObardi="http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#idObardi"
const validityPeriod="http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#validityPeriod"
const isDeprecated="http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#isDeprecated"

async function sparqlUpdateQuery(query, prefix="    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
"    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
"    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
"    PREFIX oba: <http://www.semanticweb.org/melodi/ontologies/2021/5/TSN_Obardi/>\n" +
"    PREFIX obaData: <http://www.semanticweb.org/melodi/data#>\n" +
"    PREFIX hht: <http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#> \n"+
"    PREFIX time: <http://www.w3.org/2006/time#>\n" +
"    PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" ) {
    const client = new Client({ endpointUrl: 'http://melodi.irit.fr/graphdb/repositories/ObARDI', user : 'fair', password : 'semantic', updateUrl : "http://melodi.irit.fr/graphdb/repositories/ObARDI/statements"})

    return await client.query.update(prefix+query)
}

async function sparqlAskQuery(query, prefix="    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
"    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
"    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
"    PREFIX oba: <http://www.semanticweb.org/melodi/ontologies/2021/5/TSN_Obardi/>\n" +
"    PREFIX obaData: <http://www.semanticweb.org/melodi/data#>\n" +
"    PREFIX hht: <http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#> \n"+
"    PREFIX time: <http://www.w3.org/2006/time#>\n" +
"    PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" ) {
    const client = new ParsingClient({ endpointUrl: 'http://melodi.irit.fr/graphdb/repositories/ObARDI', user : 'fair', password : 'semantic'})
    const stream = await client.query.ask(prefix+query)

}

// {'name' : null, 'idLevel' : null, 'criterion': null, 'niveau': null, 'sup' : null, 'inf' :[], date : [1661,1789]}

async function findRightURI(uriDefault){
    let version=1
    let uri=uriDefault
    while (await sparqlAskQuery("ASK WHERE {\n" +
        "{  <"+uri+"> ?p ?o . }\n" +
        "UNION\n" +
        "{?s ?p  <"+uri+"> . }\n" +
        "}")){
        version++
        uri=uriDefault+"_V"+version
    }
    return uri

}

function DatePart(begin, end, uri){
    let Query=""
    Query += "<"+uri+"> hht:validityPeriod <http://www.semanticweb.org/melodi/data#"+begin+"-"+end+">."
    Query+="<http://www.semanticweb.org/melodi/data#"+begin+"-"+end+"> time:hasBeginning <http://www.semanticweb.org/melodi/data#year"+begin+">."
    Query+="<http://www.semanticweb.org/melodi/data#"+begin+"-"+end+"> time:hasEnd <http://www.semanticweb.org/melodi/data#year"+end+">."
    Query+="<http://www.semanticweb.org/melodi/data#year"+begin+"> time:inXSDgYear \""+begin+"\"^^xsd:gYear."
    Query+="<http://www.semanticweb.org/melodi/data#year"+end+"> time:inXSDgYear \""+end+"\"^^xsd:gYear."
    return Query
}

async function attachVersionToUnit(unit, version){
    await sparqlUpdateQuery("INSERT DATA {<"+unit+"> hht:hasVersion <"+version+">.}")
}


function insertQuery (uri, state){

    let Query= "INSERT DATA\n" +
        "{ \n"

    if (state["date"]!=null && state["date"].length>1){
        let begin=state["date"][0]
        let end =state["date"][1]
        Query+=DatePart(begin, end, uri)
    }
    Query+="  <"+uri+">"
    if (state["name"]!=null){
        Query+="rdfs:label \""+state['name']+"\""
    }
    if (state["idLevel"]!=null){
        Query+="; \n"
        Query+="hht:idObardi \""+state['idLevel']+"-"+state["date"][0]+"_"+state["date"][1]+"\""
    }
    if (state["niveau"]!=null){Query+="; \n"
        Query+="hht:isMemberOf <"+state['niveau']+">"
    }
    if (state["sup"]!=null){
        Query+="; \n"
        Query+="hht:hasUpperUnit <"+state['sup']+">"
    }
    if (state["inf"]!=null){
        for (let infTer of state["inf"]){
            Query+="; \n"
            Query+="hht:hasSubUnit <"+infTer+">"
        }
    }

    Query+="; rdf:type hht:UnitVersion.}"
    return Query
}

export async function putVersionInGraph(state){
    try {
        let uriDefault="http://www.semanticweb.org/melodi/data#"+state["name"].replace(" ", "_")+"_"+state["idLevel"]+state['date'][0]+"_"+state['date'][1]
        let uri=uriDefault
        let uriMain=state["unit"]
        let begin=state["date"][0]
        let end =state["date"][1]
        for (let version of (await versionsOf(uriMain))){
            if (version["datepre"]<=begin && version["datePost"]>=begin){
                let versionSt=await getVersionState(version["value"])
                let uriDefaultNewVer= version["value"].slice(0,-9)+version["datepre"]+begin
                let uriNewVer=await findRightURI(uriDefaultNewVer)
                let Query= "INSERT DATA\n" +
                    "{ \n"
                for (let triplet of versionSt){
                    let target=triplet["t"]
                    if (target.toString().startsWith("http")){
                        target="<"+target+">"
                    } else if ((typeof target)=="string"){
                        target="\""+target+"\""
                    }
                    if (triplet["r"]!=idObardi && triplet["r"]!=validityPeriod){
                        Query+="<"+uriNewVer+"> "+"<"+triplet["r"]+"> "+target+".\n"
                    }
                }
                Query+=DatePart(version["datepre"], begin, uriNewVer)
                Query+="<"+uriNewVer+"> hht:idObardi \""+state['idLevel']+"-"+version["datepre"]+"_"+begin+"\".\n"
                Query+="}"
                await sparqlUpdateQuery(Query)
                await attachVersionToUnit(uriMain, uriNewVer)
                await sparqlUpdateQuery("INSERT DATA {<"+version["value"]+"> hht:isDeprecated true.}")
            }
            if(version["datepre"]<=end && version["datePost"]>=end){
                let versionSt=await getVersionState(version["value"])
                let uriDefaultNewVer= version["value"].slice(0,-9)+end+version["datePost"]
                let uriNewVer=await findRightURI(uriDefaultNewVer)
                let Query= "INSERT DATA\n" +
                    "{ \n"
                for (let triplet of versionSt){
                    let target=triplet["t"]
                    if (target.toString().startsWith("http")){
                        target="<"+target+">"
                    } else if ((typeof target)=="string"){
                        target="\""+target+"\""
                    }
                    if (triplet["r"]!=idObardi && triplet["r"]!=validityPeriod && triplet["r"]!=isDeprecated){
                        Query+="<"+uriNewVer+"> "+"<"+triplet["r"]+"> "+target+".\n"
                    }
                }
                Query+=DatePart(end, version["datePost"], uriNewVer)
                Query+="<"+uriNewVer+"> hht:idObardi '"+state['idLevel']+"-"+end+"_"+version["datePost"]+"'.\n"
                Query+="}"
                await attachVersionToUnit(uriMain, uriNewVer)
                await sparqlUpdateQuery(Query)
                await sparqlUpdateQuery("INSERT DATA {<"+version["value"]+"> hht:isDeprecated true.}")
            }
            if(version["datepre"]>=begin && version["datePost"]<=end){
                await sparqlUpdateQuery("INSERT DATA {<"+version["value"]+"> hht:isDeprecated true.}")
            }
        }
        uri=await findRightURI(uriDefault)
        let Query=insertQuery(uri, state)
        await attachVersionToUnit(uriMain, uri)
        let result=await sparqlUpdateQuery(Query)
        let href=""
        return [true, href, result, uri]//Pour indiquer que l'insertion est okay
    } catch(error){
        return [false, error] //Pour indiquer que l'insertion n'a pas marché
    }
}

export async function putUnitInGraph(state){
    try {let uriDefault="http://www.semanticweb.org/melodi/data#"+state["name"].replace(" ", "_")+"_"+state["idLevel"]+state['date'][0]+"_"+state['date'][1]
        let uri=uriDefault
        let uriMain="http://www.semanticweb.org/melodi/data#"+state["idLevel"]
        let queryMain="{ \n" +
            "  <"+uriMain+"> rdfs:label \""+state["name"]+"\".<"+uriMain+"> hht:idObardi \""+ state["idLevel"]+ "\". <"+uriMain+"> rdf:type hht:Unit. <"+uriMain+"> hht:hasVersion <"+uri+ ">."
        if (state["idCassini"]!=undefined && state["idCassini"]!=null) {queryMain+="  <"+uriMain+"> hht:idCassini "+state["idCassini"]+"."}
        queryMain+="}"
        await sparqlUpdateQuery("INSERT DATA\n" +queryMain
                )

        let result=await sparqlUpdateQuery(insertQuery(uri, state))
        let href=""
        return [true, href, result, uri]//Pour indiquer que l'insertion est okay
    } catch(error){

        return [false, error] //Pour indiquer que l'insertion n'a pas marché
    }
}

export async function editVersion(state, uri){
    await deleteInstance(uri)
    try {
        let uriMain=state["unit"]
        await sparqlUpdateQuery("INSERT DATA\n" +
            "{ \n" +
            " <"+uriMain+"> hht:hasVersion <"+uri+">}")
        let result=await sparqlUpdateQuery(insertQuery(uri, state))
        let href=""
        return true//Pour indiquer que l'insertion est okay
    } catch(error){
        return false //Pour indiquer que l'insertion n'a pas marché
    }
}

export async function deleteInstance(uri){
    return await sparqlUpdateQuery("DELETE {?o ?r ?t} WHERE {\n" +
        "    {VALUES ?o {<"+uri+">}. <"+uri+"> ?r ?t} UNION {VALUES ?t {<"+uri+">} ?o ?r <"+uri+">.}\n" +
        "}")
}

async function addSubUnit(mother, daughter){
    return await sparqlUpdateQuery("INSERT DATA {<"+mother+"> hht:hasSubUnit <"+daughter+">}")
}

export async function insertData(row, date, criterion){
    if (row.length>=2){
        let state={'name' : row[1], 'idCassini' :  row[0], 'criterion': criterion, 'niveau': "http://www.semanticweb.org/melodi/types#Paroisse", date : date, unit : await getURI(row[1], row[0]), inf : [], sup : null}
       let lower
        if (state['unit']!=null){
            state['idLevel']= await getId(state['unit'])
            lower=await putVersionInGraph(state)
        } else {
            state['idLevel']=await getNewId(state['niveau'])
            state['unit']=
            lower=await putUnitInGraph(state)
        }
        if (row.length%2==0){
            let numberOfLevels =row.length/2 -1
            let levels=["http://www.semanticweb.org/melodi/types#Paroisse"]
            for (let i=0; i<numberOfLevels; i++){
                levels.push(await getUpperUnit(levels[i], criterion))
                let stateUpper ={'name' : row[2*(i+1)+1], 'idCassini' :  row[2*(i+1)], idLevel : null, 'criterion': criterion, 'niveau': levels[i+1], date : date, unit : await getURI(row[2*(i+1)+1], row[2*(i+1)]), 'inf' : [lower[3]], sup : null}
                if (stateUpper['unit']!=null){
                    stateUpper['idLevel']= await getId(stateUpper['unit'])
                } else {
                    stateUpper['idLevel']=await getNewId(stateUpper['niveau'])
                }
                if (stateUpper['unit']==null){
                    lower=await putUnitInGraph(stateUpper)
                } else {
                    let version=await getVersion(stateUpper['unit'], stateUpper['date'], stateUpper['name'])
                    if (version==null){
                        lower=await putVersionInGraph(stateUpper)
                    } else {
                        await addSubUnit(version, lower[3])
                        lower=[true, "", "", version]
                }}

            }
        }
    }
    return true
}