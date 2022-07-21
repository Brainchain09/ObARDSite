import Link from 'next/link'
import React from 'react'
import Head from 'next/head'
import Page from './page.js'
import Sparql from 'sparql-http-client'

const content= (
    <div>
        <br/> <br/> <br/> <br/>
        <section className="card  col align-self-center bt-4">
            <div className="card-body">
                <form action="/admin" method="POST">
                    <input type="submit" className="btn-primary btn" name="raisonnement" value="Raisonnement"/>
                    <input type="submit" className="btn-primary btn" name="suppression"
                           value="Supprimer toutes les données"/>
                    <input type="submit" className="btn-primary btn" name="donneeBase"
                           value="Ajouter les données sur la hiérarchie"/>
                    <input type="submit" className="btn-primary btn" name="updateOntology"
                           value="mettre à jour l'ontologie (Non complétement fonctionnelle)  "/>
                </form>
            </div>
        </section>
    </div>
)

export default ()=>{
    return Page(content)
}
