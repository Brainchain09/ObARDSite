import Link from 'next/link'
import React from 'react'
import Head from 'next/head'
import Page from './page.js'



export default ()=>{


    let id=0;
    function createNewElement() {
        // First create a DIV element.
        var txtNewInputBox = document.createElement('div');

        // Then add the content (a new input box) of the element.
        txtNewInputBox.innerHTML = "<input type='text' id='newInputBox'"+id+">";

        // Finally put it where it is supposed to appear.
        document.getElementById("newElementId").appendChild(txtNewInputBox);
    }



    const content= (
        <div>
            <h2>Ajouter prétendant. </h2>
            <h3></h3>


            <form action="/conflit" method="POST">
                <fieldset>
                    <legend>Ajouter données</legend>

                    <div className="form-group col-xl-12">
                        <label htmlFor="inputConflictName">Nom du conflit</label>
                        <input type="text" name="name" className="form-control form-control-lg-6" id="inputConflictName"
                               placeholder="Nom du conflit"/>
                    </div>
                    <div className="form-group col">
                        <label htmlFor="inputUpperInstance">Zone de </label>
                        <input list="uppers" name="upperInstance" id="upperInstance" onInput="getUppers()"/>
                        <datalist id="uppers">
                        </datalist>
                    </div>
                    <div id="newElementId">Ajouter une zone au conflit</div>
                    <div id="dynamicCheck">
                        <input type="button" value="Create Element" onClick={createNewElement}/>
                    </div>
                    <div>
                        <label>&nbsp;</label>
                        <input type="submit" name="Conflit" value="Conflit" className="submit"/>
                    </div>

                </fieldset>
            </form>
        </div>
    )
    return Page(content)
}
