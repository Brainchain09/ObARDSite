import Link from 'next/link'
import React from 'react'
import Page from './page.js'
import {
    fetcherCriteres,
    fetcherNiveaux,
    fetcherNiveauxSup,
    fetcherNiveauxInf,
    isIdInDatabase,
    getTerritory,
    getNewId, getUnits, getId, getTerritoryURI
} from '../utilities/fetchers'

import {putUnitInGraph, putVersionInGraph} from '../utilities/pushers'
import Select from 'react-select'
import Popup from 'reactjs-popup'

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

import Tooltip from 'rc-tooltip'
import {printAndExit} from "next/dist/server/lib/utils";

const {Handle}=Slider


export async function getServerSideProps(props) {
    let nomenclatures= await fetcherCriteres()
    let state={'name' : null, 'idLevel' : null, 'criterion': null, 'niveau': null, 'sup' : null, 'inf' :[], date : [1661,1789], 'unit' :null}
    let editMode=false
    if (Object.keys(props.query).includes('idLevel')) {
        state=await getTerritory(props.query['idLevel'])

    } else if (Object.keys(props.query).includes('unitVersion')) {
        state=await getTerritoryURI(props.query['unitVersion'])
        console.log(state)
        //editMode=true
    }
    let level=[]
    let sup=[]
    let inf=[]
    let units=[]
    for (let data of Object.keys(props.query)) {
        state[data]=props.query[data]
    }
    if (state['criterion']!=null){
        level=await fetcherNiveaux(state['criterion'])
    }
    if (state['unit']!=null){
        units= await getUnits()
    }
    if (state['criterion']!=null && state['niveau']!=null){
        sup=await fetcherNiveauxSup(state['criterion'], state['niveau'])
        inf=await fetcherNiveauxInf(state['criterion'], state['niveau'])
    }
    return {
        props: {
            nomenclatures, state, level, sup, inf, units,editMode
        }
    }
}


const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={true}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

export default ({nomenclatures, state, level, sup, inf, units, editMode})=>{

    console.log(state)
    const [levels, setLevels]=React.useState(level)
    const [sups, setSups]=React.useState(sup)
    const [infs, setInfs]=React.useState(inf)
    const [modalOpen, setmodalOpen]=React.useState(false)
    const [modalOpenGreen, setmodalOpenGreen]=React.useState(false)
    const [Units, setUnits]=React.useState(state['unit']==null ? <div></div> : UnitField(units))
    const [isOpenUnit, setisOpenUnit]=React.useState(state['unit']!=null)
    console.log(isOpenUnit)



    async function handleSubmit(event){
        event.preventDefault()
        event.preventDefault()
        state['name']=event.target.elements.nomInstance.value
        if (state['niveau']!=null && state['criterion']!=null) {
            if (!editMode) {
                if (state['unit'] != null && state['unit'] != undefined) {
                    setmodalOpen(true)
                } else {

                    state["idLevel"] = await getNewId(state["niveau"])
                    if ((await putUnitInGraph(state))[0]) {
                        printSuccess()
                    } else {
                        //TODO : Mettre popup erreur rouge
                    }
                }


            } else {
                setmodalOpen(true)
            }
        }
        }


    function handleSlider (selected){
        console.log(selected)
        state["date"]=selected
    }
    function selectFindValue(value, list){
        let index=0
        while (index<list.length){
            if (list[index]['value']==value){
                return list[index]
            }
            index++
        }
        return null
    }
    async function handleCriterion(selected){
        setLevels(await fetcherNiveaux(selected['value']))
        console.log(state)
        if (selected!=null) {
            state['criterion']=selected['value']
        } else {
            state['criterion']=selected
        }
        console.log(state)
    }

    function handleSup(selected){
        if (selected!=null) {
            state['sup']=selected['value']
        } else {
            state['sup']=selected
        }
    }

    function handleInf(selected){
        state['inf']=selected.map(x => x['value'])
    }

    function handleUnit(selected){
        if (selected!=null) {
            state['unit']=selected['value']
        } else {
            state['unit']=selected
        }
    }

    async function handleValidate(event){
        state['idLevel']=await getId(state['unit'])
        if ((await putVersionInGraph(state))[0]){
            closeModal()
            printSuccess()
        } else {
            closeModal()
            //TODO : Mettre popup erreur rouge
        }
    }

    async function handleLevel(selected){
        if (selected!=null) {
            state['niveau']=selected['value']
            setSups(await fetcherNiveauxSup(state['criterion'],selected['value']))
            setInfs(await fetcherNiveauxInf(state['criterion'],selected['value']))
        } else {
            state['niveau']=selected
        }
    }

    function printSuccess(){
        setmodalOpenGreen(true)
    }

    function removeSuccess(){
        setmodalOpenGreen(false)
    }


    const closeModal = () => setmodalOpen(false)


    function UnitField(Units){
        return (<div><div>
        <Select className="form-control" options={Units}
                isClearable={true}
                onChange={handleUnit}
                defaultValue={selectFindValue(state['unit'], units)}
                isSearchable={true}
                />
    </div><br/></div>)}

    async function handleCheckDate(event) {
        if (!isOpenUnit){
            setUnits(await UnitField(await getUnits()))
            setisOpenUnit(true)
        } else {
            setisOpenUnit(false)
            setUnits(<div></div>)
            state['unit']=null
        }
    }


    let mainButtonText="Modifier"
    let modalText ="Les modifications apportées à une version ne sont pas réversibles .\n" +
        "Voulez vous continuer ?"
    if (!editMode){
        mainButtonText="Insérer"
        modalText="Vous vous apprêtez à créer une nouvelle version d'une entité. Si les dates selectionnées sont en conflit avec des versions existantes, celles-ci seront dépréciées et de nouvelles versions cohérentes avec celle insérée seront créées.\n" +
            "Voulez vous continuer ?"
    }


    const content= (
        <div>
            <Popup open={modalOpen} modal closeOnDocumentClick onClose={closeModal}>
                <span>
                    <div className="headerModal"> ID déjà existant </div>
                    <div className="contentModal">
                        {modalText}
                    </div>
                    <div className="actionsModal">
                        <button
                            className="button"
                            style={{marginRight : 30}}
                            onClick={handleValidate}

                        >
                            Valider
                        </button>
                        <button
                            className="button"
                            onClick={() => {
                                setmodalOpen(false)
                            }}
                        >
                            Annuler
                        </button>
                    </div>
                </span>
            </Popup>
            <Popup open={modalOpenGreen} modal closeOnDocumentClick onClose={removeSuccess} >
                <div className="alert alert-success alert-dismissible fade show" id="alert" role="alert">
                    <button id="myAlert" type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true" onClick={removeSuccess}>&times;</span></button>
                    <h4 className="alert-heading">Succès !</h4>

                    <p>
                        <h6><strong>Félicitations !</strong> Votre entité a bien été ajoutée à la base de connaissance </h6>
                    </p>
                    <hr/>


                    <p> Vous pourrez la retrouver depuis la section "Recherche" pour relire ses informations ou pour
                        d'éventuelles modifications
                    </p>
                    <p>

                        TODO
                    </p>
                </div>
            </Popup>


            <section>

                <div className="container">
                    <form action="/insert" method="POST" className="ui form" onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>
                                <center>
                                    <h2><b>Création d'une zone géographique</b></h2>
                                </center>
                            </legend>
                            <br/>

                            <div className="container mt-5">
                                <div className="row">
                                    <div className="col padding-0">
                                        <div className="field form-group mb-3">
                                            <label className="col control-label">Nom de la zone</label>


                                            <div className="col inputGroupContainer">

                                                <div className="input-group">
                                                    <span className="input-group-text"
                                                          id="basic-addon1"><i>abc</i></span>
                                                    <input type="text" name="nomInstance" className="form-control"
                                                           id="inputInstanceName" defaultValue={state['name']} placeholder="Nom de la zone" required/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="field">
                                    <label htmlFor="date"> Version d'une zone existante </label> <input type="checkbox" name="dateBool" onChange={handleCheckDate} defaultChecked={isOpenUnit}/>
                                </div>

                                {Units}

                                <div className="field form-group mb-3 notParoisse">
                                    <label className="col control-label"> Critère hiérarchique</label>
                                    <div className="col inputGroupContainer">
                                        <div className="input-group">
                                            <Select id="nomenclature" name="nomenclature" className="form-control" options={nomenclatures}
                                                    onChange={handleCriterion} isClearable={true}
                                                    isSearchable={true}
                                                    defaultValue={selectFindValue(state['criterion'], nomenclatures)}
                                                    required/>
                                        </div>
                                    </div>
                                </div>

                                <div className="field form-group col-md-12 notParoisse">
                                    <label htmlFor="level">Niveau hiérarchique </label>
                                    <Select id="nomenclature" name="nomenclature" className="form-control" options={levels}
                                            onChange={handleLevel}
                                            defaultValue={selectFindValue(state['niveau'], levels)}
                                            required  isClearable={true}
                                            isSearchable={true}/>
                                </div>
                                <div className="field form-group mb-4">
                                    <label className="col control-label">Zone géographique supérieure </label>
                                    <Select id="nomenclature" name="nomenclature" className="form-control" options={sups}
                                            isClearable={true}
                                            onChange={handleSup}
                                            defaultValue={selectFindValue(state['sup'], sups)}
                                            isSearchable={true}
                                            required/>
                                </div>
                                <div className="field form-group mb-4">
                                    <label className="col control-label"> Territoires contenus dans cette zone </label>
                                    <div className="col inputGroupContainer input-group">
                                        <Select id="nomenclature" name="nomenclature" className="form-control" options={infs}
                                                isClearable={true}
                                                isSearchable={true}
                                                onChange={handleInf}
                                                defaultValue={state['inf'].map(x=> selectFindValue(x, infs))}
                                                isMulti
                                                required/>
                                    </div>
                                    <div >
                                        <input type="hidden" name="territory" id="territory" value="1"/>
                                        <p className="field territory">
                                            <label htmlFor="amount"> Période de validité : </label>
                                            <div style={{paddingTop : 30, paddingBottom : 10}}>
                                                <Range
                                                    min={1661}
                                                    max={1789}
                                                    onAfterChange={handleSlider}
                                                    defaultValue={state['date']}
                                                    allowCross={false}
                                                    handle={handle}
                                                    tipProps={{visible:true}}
                                                />
                                            </div>
                                        </p>
                                    </div>
                                </div>
                                <label>&nbsp;</label>
                                <input type="submit" name="Insert" value={mainButtonText} className="ui btn btn-primary"
                                       className="submit"/>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </section>
        </div>)

    return Page(content)
}
