import Link from 'next/link'
import React from 'react'
import Head from 'next/head'
import Page from './page.js'
import Fiche from './dataFiche'
import Sparql from 'sparql-http-client'
import {
 getFiche
} from "../utilities/fetchers";


export async function getServerSideProps(props) {
    let state={'Nom de la Zone' : "Inconnu", 'Identifiant ObARDI' : "Inconnu", 'Niveau Hiérarchique': "Inconnu", "Dates :" : "Inconnu", 'Territoire Supérieur' : "Inconnu", 'Territoire Inférieur' : "Inconnu"}
    let unit=null
    if (Object.keys(props.query).includes('unit')) {
        state=await getFiche(props.query['unit'])
        unit=props.query['unit']
    }
    return {
        props: {
            state, unit
        }
    }
}




export default ({state,unit})=>{
    async function modify(){
        window.open("/insert?unitVersion="+unit,"_self")
    }

    async function add(){
        window.open("/insert?idLevel="+state['Identifiant ObARDI'].split("-")[0],"_self")
    }
    const content= (
        <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <Fiche content={state} title={"Connaissances concernant "+state["Nom de la Zone"]}/>
            <div className="row justify-content-center" id="beginButton">
                <div className="col-2 mt-3">
                    <button type="button" className="btn btn-primary" value="Modifer" id="Modifier" onClick={modify}>Modifier</button>
                </div>
                <div className="col-3 mt-3">
                    <button type="button" className="btn btn-primary" id="AjouterNouvelleVersion" onClick={add}>Ajouter une nouvelle
                        version
                    </button>
                </div>
            </div>


            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
)
    return Page(content)
}
