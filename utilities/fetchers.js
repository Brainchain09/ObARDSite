const ParsingClient = require('sparql-http-client/ParsingClient')


//TODO Gérer le cas où un paramètre est null
async function sparqlQuery(query, prefix="    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
"    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
"    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
"    PREFIX oba: <http://www.semanticweb.org/melodi/ontologies/2021/5/TSN_Obardi/>\n" +
"    PREFIX obaData: <http://www.semanticweb.org/melodi/data#>\n" +
"    PREFIX hht: <http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#> \n"+
"    PREFIX time: <http://www.w3.org/2006/time#>\n" +
"    PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" ) {
    console.log(query)
    const client = new ParsingClient({ endpointUrl: 'http://melodi.irit.fr/graphdb/repositories/ObARDI' , user : 'fair', password : 'semantic'})
    const stream = await client.query.select(prefix+query)
    const results=[]


    stream.forEach(row => {
        let data={}
        Object.entries(row).forEach(([key, value]) => {
            data[key]=value.value
        })
        results.push(data)
    })
    return results
}


export async function getGraph(){
    let prefix="    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
    "    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
    "    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
    "    PREFIX oba: <http://www.semanticweb.org/melodi/ontologies/2021/5/TSN_Obardi/>\n" +
    "    PREFIX obaData: <http://www.semanticweb.org/melodi/data#>\n" +
    "    PREFIX hht: <http://www.semanticweb.org/lucas/ontologies/2021/11/HHT_Ontology#> \n"+
    "    PREFIX time: <http://www.w3.org/2006/time#>\n" +
    "    PREFIX owl: <http://www.w3.org/2002/07/owl#>\n"
    let query="CONSTRUCT {?o ?r ?t} WHERE{?o ?r ?t}"
        const client = new ParsingClient({ endpointUrl: 'http://melodi.irit.fr/graphdb/repositories/ObARDI' , headers : {'Authorization' : 'GDB eyJ1c2VybmFtZSI6ImZhaXIiLCJhdXRoZW50aWNhdGVkQXQiOjE2NDkzMjQ0MzA3NjN9.WT2C+07p7zzzE0xTt8pOZev8iA4TRPb+aMwAhh2yHAs='}})
        const graph = await client.query.construct(prefix+query)
        return graph
}

export async function fetcherCriteres() {
    let criteres= await sparqlQuery("select ?value ?label where { \n" +
        "?value a hht:HierarchicalCriterion.\n" +
        "?value rdfs:label ?label.\n" +
        "} ")

    return criteres
}

export async function fetcherNiveaux(critere) {
    let niveaux= await sparqlQuery("select ?value ?label WHERE {\n" +
        "    ?value a hht:LevelVersion.\n" +
        "    ?value rdfs:label ?label.\n" +
        "  \t?value hht:isLevelOf <"+critere+">\n" +
        "}")

    return niveaux
}

export async function fetcherNiveauxSup(critere, niveauCourant) {
    let sups= await sparqlQuery("select ?value ?label WHERE {\n" +
        "    <"+niveauCourant+"> hht:hasUpperLevel ?upper.\n" +
        "    ?upper hht:isLevelOf <"+critere+">.\n" +
        "    ?value a hht:UnitVersion.\n" +
        "    ?value rdfs:label ?label.\n" +
        "    ?value hht:isMemberOf ?upper.\n" +
        "}")
    return sups
}
export async function fetcherNiveauxInf(critere, niveauCourant) {
    let infs= await sparqlQuery("select ?value ?label WHERE {\n" +
        "    <"+niveauCourant+"> hht:hasSubLevel ?lower.\n" +
        "    ?lower hht:isLevelOf <"+critere+">.\n" +
        "    ?value a hht:UnitVersion.\n" +
        "    ?value rdfs:label ?label.\n" +
        "    ?value hht:isMemberOf ?lower.\n" +
        "}")
    return infs
}

export async function isIdInDatabase(id, niveau){
    let found= await sparqlQuery("select ?value ?label WHERE {\n" +
        " ?value hht:hasVersion ?valueVersion. \n"+
        "    ?valueVersion hht:isMemberOf <"+niveau+">.\n" +
        "    ?value hht:idObardi \""+id+"\".\n" +
        "}")
    return (found.length!=0)
}

export async function getId(uri){
    let id= await sparqlQuery("select ?id WHERE {\n" +
        "    <"+uri+"> hht:idObardi ?id.\n" +
        "}")
    return id[0]["id"]
}

async function formatTerritories(found){

    if (found.length==0){
        return {'name' : null, 'idLevel' : null, 'criterion': null, 'niveau': null, 'sup' : null, 'inf' :[], "date" : [1661,1789], "unit" :null}
    } else {
        let state=found[0]
        let uri=state['value']
        state['date']=[state['datepre'],state['datePost'] ]
        state['inf']=[]
        let infs= await sparqlQuery("select ?sub WHERE {\n" +
            "    <"+uri+"> hht:hasSubUnit ?sub.\n" +
            "}")
        for (let sub of infs){
            state["inf"].push(sub["sub"])
        }
        return state
    }
}
export async function getTerritoryURI(uri){
    let found= await sparqlQuery("select ?unit ?name ?idLevel ?criterion ?niveau ?sup ?value ?datepre ?datePost WHERE {\n" +
        "    VALUES ?value {obaData:"+uri+"}.\n" +
        " ?unit hht:hasVersion ?value \n"+
        "    OPTIONAL {?value rdfs:label ?name.}\n" +
        "    OPTIONAL {?value hht:idObardi ?idLevel.}\n" +
        " \tOPTIONAL {?value hht:isMemberOf ?niveau.}\n" +
        "    OPTIONAL {?niveau hht:isLevelOf ?criterion.}\n" +
        "    OPTIONAL {?value hht:hasUpperUnit ?sup.}\n" +
        "   \tOPTIONAL {?value hht:validityPeriod ?period.\n" +
        "\t?period time:hasBeginning ?startYear.\n" +
        "\t?startYear time:inXSDgYear ?datepre.\n" +
        "\t?period time:hasEnd ?endYear.\n" +
        "    ?endYear time:inXSDgYear ?datePost.}\n" +
        "}")
    return await formatTerritories(found)
}

export async function getTerritory(id){
    //TODO à améliorer
    let found= await sparqlQuery("select ?unit ?name ?idLevel ?criterion ?niveau ?sup ?value ?datepre ?datePost WHERE {\n" +
        "    ?unit hht:idObardi \""+id+"\".\n" +
        "     ?unit hht:hasVersion ?value \n"+
        "    OPTIONAL {?value rdfs:label ?name.}\n" +
        "    OPTIONAL {?value hht:idObardi ?idLevel.}\n" +
        " \tOPTIONAL {?value hht:isMemberOf ?niveau.}\n" +
        "    OPTIONAL {?niveau hht:isLevelOf ?criterion.}\n" +
        "    OPTIONAL {?value hht:hasUpperUnit ?sup.}\n" +
        "   \tOPTIONAL {?value hht:validityPeriod ?period.\n" +
        "\t?period time:hasBeginning ?startYear.\n" +
        "\t?startYear time:inXSDgYear ?datepre.\n" +
        "\t?period time:hasEnd ?endYear.\n" +
        "    ?endYear time:inXSDgYear ?datePost.}\n" +
        "}")
   return await formatTerritories(found)
}

export async function fetcherTerritoire(){
    return [{value :"0", label :"Paroisse1" },
        {value :"1", label :"Election2" }]
}

export async function fetcherRecherche(state){

    let query="select distinct ?unit ?name ?version ?startYear ?endYear WHERE { \n" +
        "    ?unit a hht:Unit.\n" +
        "    ?unit rdfs:label ?name.\n"+
        "    ?unit hht:hasVersion ?version.\n"+"    ?version hht:validityPeriod ?interval.\n" +
        "    ?interval time:hasBeginning ?startDate.\n" +
        "    ?startDate time:inXSDgYear ?startYear.\n" +
        "    ?interval time:hasEnd ?endDate.\n" +
        "    ?endDate time:inXSDgYear ?endYear.\n"

    if (state.name!=null && state.name!=undefined && state.name!=""){
        query+="    ?unit rdfs:label ?name.\n" +
            "    FILTER regex(?name, \"^.*"+state.name+".*$\", \"i\") \n" +
            "    \n"
    }

    if (state.criterion!=null && state.criterion!=undefined){
        query+="    ?version hht:isMemberOf ?level.\n" +
            "    ?level hht:isLevelOf <"+state.criterion+">.\n" +
            "    \n"
    }

    if (state.niveau!=null && state.niveau!=undefined){
        query+= "    ?version hht:isMemberOf <"+state.niveau+">.\n"
    }

    if (state.sup!=null && state.sup!=undefined){
        query+= "    ?version hht:hasUpperUnit ?upperVersion.\n" +
            "    <"+state.sup+"> hht:hasVersion ?upperVersion.\n" +
            "    \n"
    }



    if (state.hasDate){
        query+=
        "    FILTER ((year(?startYear) <= "+state.date+") &&(year(?endYear) >= "+state.date+"))\n"
    }


    if (!state.include){
        query+="    FILTER NOT EXISTS {" +
        "?version hht:isDeprecated true. }"
    }


    query+="}\n" +
        "ORDER BY ?unit"
    let results=await sparqlQuery(query)
    let tree=[]
    if (results.length>0){
        let currentNode=[]
        let currentUnit=null
        let unit=null
        let currentName=null
        for (let result of results){
            console.log(result)
            unit=result.unit

            let name=result.name
            currentUnit=(currentUnit==null) ? unit : currentUnit
            currentName=(currentName==null) ?name : currentName
            if (unit!=currentUnit){
                tree.push({id : currentUnit, label : currentName, hasCaret : true, isExpanded : false,  childNodes : currentNode})
                currentNode=[]
                currentUnit=unit
                currentName=name
            }
            currentNode.push( {id : result.version, label : result.name + " ("+result.startYear+"-"+result.endYear+")", hasCaret : false})

        }
        tree.push({id : unit, label : currentName, hasCaret : true, isExpanded : false,  childNodes : currentNode})
    } else {
        tree=[{label :"Aucun résultat", hasCaret : false, isExpanded : false}]
    }

    return tree
}

export async function versionsOf(uri){
    let versions= await sparqlQuery("SELECT DISTINCT ?value ?datepre ?datePost WHERE\n" +
        "{ ?value rdf:type hht:UnitVersion.\n" +
        "    <"+uri+"> hht:hasVersion ?value.\n" +
        "        OPTIONAL {?value hht:validityPeriod ?period.\n" +
        "        ?period time:hasBeginning ?startYear.\n" +
        "        ?startYear time:inXSDgYear ?datepre.\n" +
        "        ?period time:hasEnd ?endYear.\n" +
        "        ?endYear time:inXSDgYear ?datePost.}\n" +
        "    FILTER NOT EXISTS {\n" +
        "    ?value hht:isDeprecated true\n" +
        "}\n" +
        "} ")
    return versions
}


export async function getNewId(niveau){
    let state= await sparqlQuery("select ?id WHERE {\n" +
        " ?value hht:hasVersion ?valueVersion. \n"+
    "    ?valueVersion hht:isMemberOf <"+niveau+">.\n" +
    "    ?value hht:idObardi ?id.\n" +
    "}")
    let ids=state.map(x=>x['id'])
    let num=1
    let levelName=niveau.split('#')[1]
    let id=levelName+num.toString().padStart(6, '0')
    while (ids.includes(id)){
        num++
        id=levelName+num.toString().padStart(6, '0')
    }
    return id
}


export async function getVersionState(uri){
    let state= await sparqlQuery("SELECT DISTINCT ?r ?t WHERE\n" +
        "{ <"+uri+"> ?r ?t\n" +
        "    FILTER NOT EXISTS {\n" +
        "        <"+uri+"> hht:validityPeriod ?t\n" +
        "    }\n" +
        "}")
    return state
}

export async function getUnits(){
    let Units=await sparqlQuery("SELECT DISTINCT ?unit ?name ?niveau WHERE{\n" +
        "    ?unit a hht:Unit.\n" +
        "    ?unit rdfs:label ?name.\n" +
        "   \t?unit hht:hasVersion ?v.\n" +
        "    ?v hht:isMemberOf ?niveau.\n" +
        "}")
    return Units.map(x=>({'value' : x["unit"], 'label' :x["name"]+" ("+x["niveau"].split("#")[1]+")"}))
}

export async function getURI(name, cassini){
    let Units=await sparqlQuery("SELECT DISTINCT ?unit WHERE {\n" +
        "    ?unit a hht:Unit.\n" +
        "    ?unit hht:hasVersion ?version.\n" +
        "   ?version rdfs:label \""+name+"\".\n" +
        "    ?unit hht:idCassini "+cassini+".\n" +
        "}")
    if (Units.length==0){
        return null
    } else {
        return Units[0]["unit"]
    }
}

export async function getUpperUnit(level, criterion){

    let Units=await sparqlQuery("SELECT DISTINCT ?level WHERE {\n" +
        "    <"+level+"> hht:hasUpperLevel ?level.\n" +
        "    ?level hht:isLevelOf <"+criterion+">.\n" +
        "}")
    if (Units.length==0){
        return null
    } else {
        return Units[0]["level"]
    }
}


async function getNom(uri){
    let names=await sparqlQuery("SELECT ?name WHERE {<"+uri+"> rdfs:label ?name}")
    return names[0]['name']
}

export async function getFiche(unit){
        let unitData=await getTerritoryURI(unit)
    let infString=""
        console.log(unitData['inf'])
        for (let inf of unitData['inf']){
            infString+=await getNom(inf)+", "
        }
        infString=infString.slice(0,-2)
        return {'Nom de la Zone' : unitData["name"], 'Identifiant ObARDI' : unitData["idLevel"], 'Niveau Hiérarchique': await getNom(unitData["niveau"]), "Dates :" : unitData["date"][0]+"-"+unitData["date"][1], 'Territoire Supérieur' : await getNom(unitData['sup']), 'Territoire Inférieur' :infString}

}

export async function getVersion(unit, dates, nom){
    let Units=await sparqlQuery("SELECT DISTINCT ?version WHERE {\n" +
        "    <"+unit+"> hht:hasVersion ?version.\n" +
        "    ?version rdfs:label \""+nom+"\".\n" +
        "?version hht:validityPeriod ?period.\n" +
    "        ?period time:hasBeginning ?startYear.\n" +
    "        ?startYear time:inXSDgYear "+dates[0]+".\n" +
    "        ?period time:hasEnd ?endYear.\n" +
    "        ?endYear time:inXSDgYear "+dates[1]+"."+
        "}")
    if (Units.length==0){
        return null
    } else {
        return Units[0]["version"]
    }
}
