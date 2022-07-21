import Link from 'next/link'
import React from 'react'
import Head from 'next/head'
import Page from './page.js'
import Sparql from 'sparql-http-client'

const content= (
    <div>
    <div className="accordion" id="accordionExample">
        <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Tours(1697) - Chinon(1700) --[Integration]--> Tours(1712) - Chinon(1712)
                </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                 data-bs-parent="#accordionExample">
                <div className="accordion-body">
                    <div className="container px-5 my-5">
                        <form id="changeForm1">
                            <div className="row">
                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="nom1" type="text" placeholder="Nom"
                                               value="Tours(1697)" readOnly/>
                                        <label htmlFor="nom">Nom</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="id1" type="text" placeholder="ID"
                                               value="371"
                                               readOnly/>
                                        <label htmlFor="id1">ID</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="instanceSuperieure1" type="text"
                                               placeholder="Instance Supérieure" value="Orléans" readOnly/>
                                        <label htmlFor="instanceSuperieure1">Instance Supérieure</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS1" type="text"
                                                  placeholder="Instance(s) Inférieure(s)" style={{height: '10rem'}}
                                                  readOnly>
Ambillon
Artannes
Azay-le-Rideau
Azay-sur-Cher
Ballan
Beaumont-la-Ronce
Beaumont-lès-Tours
Bueil
Cerelles
Chambray
Chanceaux
Charentilly
Chenusson
Château-Renault
Cigogné
Cleré
Crotelles
Dame-Marie
Druye
Evres
Fondettes
Joué
La_Chapelle-aux-Naux
La_Ville-aux-Dames
Langeais
Lariche
Larçay
Le_Boulay
Le_Serrin
Lignières
Louestault
Luynes
Marray
Mazières
Mettray
Miré
Monnoye
Montbazon
Monts
Morand
Neuillé-Pont-Pierre
Neuville
Neuvy
Nouzilly
Oé
Parçay
Pernay
Roche-Corbon
Rouzières
Saint-Antoine
Saint-Aubin
Saint-Avertin
Saint-Christophe
Saint-Cyr
Saint-Etienne-de-Chigni
Saint-Etienne
Saint-Genouph
Saint-Georges
Saint-Laurent-de-Langeais
Saint-Laurent
Saint-Marc
Saint-Nicolas-des-Motets
Saint-Paterne
Saint-Pierre-des-Corps
Saint-Roch
Saint-Symphorien
Sainte-Branche
Sainte-Radegonde
Samblançay
Saunay
Savonnières
Tours
Amboise
Richelieu
Loudun
Loches
Baugé
Saumur
La_Flèche
Château-du-Loir

                                        </textarea>
                                        <label htmlFor="instanceSInferieureS1">Instance(s) Inférieure(s)</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS1M" type="text"
                                                  placeholder="Instance(s) Inférieure(s) se modifiant"
                                                  style={{height: '10rem'}} readOnly>

Berthenay
Brêche

                                        </textarea>
                                        <label htmlFor="instanceSInferieureS1M">Instance(s) Inférieure(s) se
                                            modifiant</label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div align="center">
                                        <select className="form-select" id="floatingSelect"
                                                aria-label="Floating label select example">
                                            <option value="0" selected>Integration</option>
                                            <option value="1">Fusion</option>
                                            <option value="2">Extraction</option>
                                            <option value="3">Scission</option>
                                            <option value="4">Rectification</option>
                                            <option value="5">Reallocation</option>
                                            <option value="6">Changement de nom</option>
                                            <option value="7">Changement d'instance supérieure</option>
                                            <option value="8">Changement d'instance(s) inférieure(s)</option>
                                        </select>
                                        <label htmlFor="floatingSelect">Séléctionner un changement</label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="nom1" type="text" placeholder="Nom"
                                               value="Tours(1712)" readOnly/>
                                        <label htmlFor="nom">Nom</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="id1" type="text" placeholder="ID"
                                               value="371"
                                               readOnly/>
                                        <label htmlFor="id1">ID</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="instanceSuperieure1" type="text"
                                               placeholder="Instance Supérieure" value="Orléans" readOnly/>
                                        <label htmlFor="instanceSuperieure1">Instance Supérieure</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS1" type="text"
                                                  placeholder="Instance(s) Inférieure(s)" style={{height: '10rem'}}
                                                  readOnly>
Ambillon
Artannes
Azay-le-Rideau
Azay-sur-Cher
Ballan
Beaumont-la-Ronce
Beaumont-lès-Tours
Berthenay
Brêche
Bueil
Cerelles
Chambray
Chanceaux
Charentilly
Chenusson
Château-Renault
Cigogné
Cleré
Crotelles
Dame-Marie
Druye
Evres
Fondettes
Joué
La_Chapelle-aux-Naux
La_Ville-aux-Dames
Langeais
Lariche
Larçay
Le_Boulay
Le_Serrin
Lignières
Louestault
Luynes
Marray
Mazières
Mettray
Miré
Monnoye
Montbazon
Monts
Morand
Neuillé-Pont-Pierre
Neuville
Neuvy
Nouzilly
Oé
Parçay
Pernay
Roche-Corbon
Rouzières
Saint-Antoine
Saint-Aubin
Saint-Avertin
Saint-Christophe
Saint-Cyr
Saint-Etienne-de-Chigni
Saint-Etienne
Saint-Genouph
Saint-Georges
Saint-Laurent-de-Langeais
Saint-Laurent
Saint-Marc
Saint-Nicolas-des-Motets
Saint-Paterne
Saint-Pierre-des-Corps
Saint-Roch
Saint-Symphorien
Sainte-Branche
Sainte-Radegonde
Samblançay
Saunay
Savonnières
Sonzay
Sorigny
Souvigné
Thilouze
Tours
Vallers
Vallière
Veignié
Veretz
Vernon
Villandry
Ville-Domer
Villebourg
Villeperdue
Vouvray
Chinon
Tours
Amboise
Richelieu
Loudun
Loches
Baugé
Saumur
La_Flèche
Château-du-Loir

                                        </textarea>
                                        <label htmlFor="instanceSInferieureS1">Instance(s) Inférieure(s)</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS1" type="text"
                                                  placeholder="Instance(s) Inférieure(s)" style={{height: '10rem'}}
                                                  readOnly>

                                        </textarea>
                                        <label htmlFor="instanceSInferieureS4M">Instance(s) Inférieure(s) se
                                            modifiant</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="nom2" type="text" placeholder="Nom"
                                               value="Chinon(1700)" readOnly/>
                                        <label htmlFor="nom2">Nom</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="id2" type="text" placeholder="ID"
                                               value="456"
                                               readOnly/>
                                        <label htmlFor="id2">ID</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="instanceSuperieure2" type="text"
                                               placeholder="Instance Supérieure" value="Tours" readOnly/>
                                        <label htmlFor="instanceSuperieure2">Instance Supérieure</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS2" type="text"
                                                  placeholder="Instance(s) Inférieure(s)" style={{height: '10rem'}}
                                                  readOnly>
Sonzay
Sorigny
Souvigné
Thilouze
Tours
Vallers
Vallière
Veignié
Veretz
Vernon
Villandry
                                        </textarea>
                                        <label htmlFor="instanceSInferieureS2">Instance(s) Inférieure(s)</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS1" type="text"
                                                  placeholder="Instance(s) Inférieure(s)" style={{height: '10rem'}}
                                                  readOnly>

                                        </textarea>
                                        <label htmlFor="instanceSInferiorS4M">Instance(s) Inférieure(s) se
                                            modifiant</label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div align="center">
                                        <select className="form-select" id="floatingSelect"
                                                aria-label="Floating label select example">
                                            <option value="0" selected>Integration</option>
                                            <option value="1">Fusion</option>
                                            <option value="2">Extraction</option>
                                            <option value="3">Scission</option>
                                            <option value="4">Rectification</option>
                                            <option value="5">Reallocation</option>
                                            <option value="6">Changement de nom</option>
                                            <option value="7">Changement d'instance supérieure</option>
                                            <option value="8">Changement d'instance(s) inférieure(s)</option>
                                        </select>
                                        <label htmlFor="floatingSelect">Séléctionner un changement</label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="nom1" type="text" placeholder="Nom"
                                               value="Chinon(1712)" readOnly/>
                                        <label htmlFor="nom">Nom</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="id1" type="text" placeholder="ID"
                                               value="456"
                                               readOnly/>
                                        <label htmlFor="id1">ID</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="instanceSuperieure1" type="text"
                                               placeholder="Instance Supérieure" value="Tours" readOnly/>
                                        <label htmlFor="instanceSuperieure1">Instance Supérieure</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS1" type="text"
                                                  placeholder="Instance(s) Inférieure(s)" style={{height: '10rem'}}
                                                  readOnly>
Sonzay
Sorigny
Souvigné
Thilouze
Tours
Vallers
Vallière
Veignié
Veretz
Vernon
Villandry

                                        </textarea>
                                        <label htmlFor="instanceSInferieureS1">Instance(s) Inférieure(s)</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="instanceSInferieureS1" type="text"
                                                  placeholder="Instance(s) Inférieure(s)" style={{height: '10rem'}}
                                                  readOnly>
Berthenay
Brêche

                                        </textarea>
                                        <label htmlFor="instanceSInferieureS4M">Instance(s) Inférieure(s) se
                                            modifiant</label>
                                    </div>
                                </div>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-primary btn-lg disabled" id="submitButton"
                                        type="submit">Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Loches(1712) - Chinon(1712) --[Integration]--> Loches(1715) - Chinon(1715)
                </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                 data-bs-parent="#accordionExample">
                <div className="accordion-body">
                    <strong>This is the third item's accordion body.</strong> It is hidden by default, until the
                    collapse plugin adds the appropriate classes that we use to style each element. These classes
                    control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                    modify any of this with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit
                    overflow.
                </div>
            </div>
        </div>
    </div>
    </div>
)

export default ()=>{
    return Page(content)
}
