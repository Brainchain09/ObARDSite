import Link from 'next/link'
import React from 'react'
import Head from 'next/head'
import Page from './page.js'

const content= (
    <div>
        <h2>Ajouter prétendant. </h2>
        <h3></h3>


        <form action="/claimer" method="POST">
            <fieldset>
                <legend>Ajouter données</legend>

                <div className="form-group col-xl-12">
                    <label htmlFor="inputClaimerName">Prétendant</label>
                    <input type="text" name="name" className="form-control form-control-lg-6" id="inputClaimerName"
                           placeholder="Nom du prétendant"/>
                </div>
                <div>
                    <label>&nbsp;</label>
                    <input type="submit" name="Claimer" value="Claimer" className="submit"/>
                </div>
            </fieldset>
        </form>
    </div>
)

export default ()=>{
    return Page(content)
}
