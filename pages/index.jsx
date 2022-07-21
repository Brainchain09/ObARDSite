import Link from 'next/link'
import React from 'react'
import Page from './page.js'

const content= (
    <div >
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Obardi</h1>
                    <p className="col-md-8 fs-4">

                        L'application TSN-Obardi a pour volonté de mutualiser des données de sources
                        historiques portant sur des données territoriales afin d'étudier les conflits et les raisons de ces
                        conflits.
                        <br/>
                        Il a été dévelopé dans le cadre du projet ObARDI, se concentrant sur les évolutions territoriales dans
                        l'Ancien Régime.
                    </p>
                    <button className="btn btn-primary btn-lg" type="button"><a href="https://obardi.hypotheses.org/le-projet"
                                                                                className="btn btn-primary btn-lg">En savoir
                        plus sur le projet</a></button>
                </div>
            </div>


        <div className="row">
            <div className="col-md-4 bg-light border">
                <h2>Insérer des données</h2>
                <p>
                    Accéder aux formulaires afin de pouvoir insérer des données et enrichir notre base de connaissances.
                </p>
                <p><a className="btn btn-outline-secondary " href="insert">Insérer »</a></p>
            </div>
            <div className="col-md-4 bg-light border">
                <h2>Importer des données</h2>
                <p>Utiliser un fichier CSV pour importer des données plus rapidement.</p>
                <p><a className="btn btn-outline-secondary" href="import">Importer »</a></p>
            </div>
            <div className="col-md-4 bg-light border">
                <h2>Faire une recherche</h2>
                <p>Parcourir les données précédemment importées afin de faire une recherche en utilisant plusieurs filtres mis à
                    disposition.</p>
                <p><a className="btn btn-outline-secondary" href="research">Rechercher »</a></p>
            </div>
        </div>
    </div>
)

export default ()=>{
    return Page(content)
}
