import Link from 'next/link'
import React from 'react'
import Head from 'next/head'
import Page from './page.js'
import rdf from 'rdf-ext'
import SparqlClient from 'sparql-http-client'


async function sparqlQuery() {
    const client = new SparqlClient({ endpointUrl: 'http://melodi.irit.fr/graphdb/repositories/ObARDI' , headers : {'Authorization' : 'GDB eyJ1c2VybmFtZSI6ImZhaXIiLCJhdXRoZW50aWNhdGVkQXQiOjE2NDkzMjQ0MzA3NjN9.WT2C+07p7zzzE0xTt8pOZev8iA4TRPb+aMwAhh2yHAs='}})
    const stream = await client.query.select(
        "    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
        "    PREFIX oba: <http://www.semanticweb.org/melodi/ontologies/2021/5/TSN_Obardi/>\n" +
        "    PREFIX obaData: <http://www.semanticweb.org/melodi/data#>\n" +
        "    PREFIX tsn: <http://purl.org/net/tsn#>\n" +
        "    PREFIX time: <http://www.w3.org/2006/time#>\n" +
        "    PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
        "    PREFIX tsnchange: <http://purl.org/net/tsnchange#>\n"+"SELECT ?nomClasse WHERE { ?nomClasse a owl:Class }")
    console.log(stream)
    stream.on('data', row => {
        Object.entries(row).forEach(([key, value]) => {
            console.log(`${key}: ${value.value} (${value.termType})`)
        })
    })
    stream.on('error', err => {
        console.log("Failure")
    })

    return {}


}

export async function getServerSideProps() {

    let nomenclatures= await sparqlQuery()
    return {
        props: {
            nomenclatures
        }
    }
}

const content= (
    <div>
        <h2> Exploration du graphe de connaissance </h2>

        <section class="border rounded">

            <p class="center">Ici on trouve le choix de la nomenclature </p>
            <form action="/explore_hierarchy" method="GET">

                <select name="nomenclature" id="nomenclature">

                </select>

                <br/>
                <br/>

                <input type="submit" class="btn btn-primary col-4" value="Le graphe de la hiérarchie"/>
                <br/>
                <br/>


                <button type="button" class="btn btn-primary col-4">
                    Le graphe de connaissance des zones géographiques
            </button>
                <button type='button' onClick={sparqlQuery}> Test</button>
            <button type="button" class="btn btn-primary col-4">
                Carte géographique
            </button>
            </form>
    </section>
    </div>
)

export default ({nomenclatures})=>{
    return Page(content)
}
