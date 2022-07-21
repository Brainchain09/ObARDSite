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
    fetcherTerritoire, fetcherRecherche, getUnits
} from '../utilities/fetchers'
import '@blueprintjs/core/lib/css/blueprint.css';
import { Tree, Classes } from "@blueprintjs/core";

import {selectFindValue} from '../utilities/tools'

import {putUnitInGraph} from '../utilities/pushers'
import Select from 'react-select'
import Popup from 'reactjs-popup'
import Slider from 'rc-slider'
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const {Handle}=Slider

import Tooltip from 'rc-tooltip'
import {printAndExit} from "next/dist/server/lib/utils";

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

export async function getServerSideProps(props) {
    let nomenclatures= await fetcherCriteres()
    let state={'name' : null, 'niveau' : null, 'criterion': null, sup : null, date : 1700, hasDate: false, include : false}
    let level=[]
    let sups=await getUnits()
    for (let data of Object.keys(props.query)) {
        state[data]=props.query[data]
    }
    if (state['criterion']!=null){
        level=await fetcherNiveaux(state['criterion'])
    }
    if (state['criterion']!=null && state['niveau']!=null){
        sups=await fetcherTerritoire()
    }
    return {
        props: {
            nomenclatures, state, level, sups
        }
    }
}


export default ({nomenclatures, state, level, sups})=>{


    function handleSlider (selected){
        state["include"]=!state.include
    }

    let timeSlider=(
        <div className="two fields">
            <div className="field">

        <div className="slidecontainer">
            <Slider
                min={1661}
                max={1789}
                onAfterChange={handleSlider}
                defaultValue={state['date']}
                handle={handle}
                tipProps={{visible:true}}
            />
        </div>
        </div>
    </div>)
    const [levels, setLevels]=React.useState(level)
    const [date, setDate]=React.useState(!state['hasDate'] ? <div></div> : timeSlider)
    const [tree, setTree]=React.useState([])
    const [isOpen, setIsOpen]=React.useState({})

    function handleLevel(selected){
        if (selected!=null) {
            state['niveau']=selected['value']
        } else {
            state['niveau']=selected
        }
    }



    function handleCheckDeprecated(check){
        state['include']=!state.include

    }
    function handleCheckDate(check){
        state['hasDate']=!state.hasDate
        if (state['hasDate']){
            setDate(timeSlider)
        } else {
            setDate(<div>
            </div>)
        }
    }

    async function handleCriterion(selected){
        setLevels(await fetcherNiveaux(selected['value']))
        if (selected!=null) {
            state['criterion']=selected['value']
        } else {
            state['criterion']=selected
        }
    }

    async function searchSubmit(event){
        event.preventDefault()
        state['name']=event.target.elements.name.value
        setTree(await fetcherRecherche(state))
    }


    function handleSup(selected){
        if (selected!=null) {
            state['sup']=selected['value']
        } else {
            state['sup']=selected
        }
    }


    const content= (
        <div>
            <h1 className="text-center mt-2"> Recherche d'une zone géographique </h1>
            <div className="bg-warning text-center rounded-5"> </div>
            <form className="ui large form" action="/research" method="get" onSubmit={searchSubmit}>
                <h4 className="ui dividing header"> Critères de recherche </h4>
                <div className="field">
                    <label htmlFor="name" autofocus> Nom </label>
                    <input type="text" name="name" defaultValue={state['name']}/>
                </div>
                <div className="two fields">
                    <div className="field">
                        <label htmlFor="nomenclature"> Critère hiérarchique </label>
                        <Select id="nomenclature" name="nomenclature" className="form-control" options={nomenclatures}
                                onChange={handleCriterion} isClearable={true}
                                isSearchable={true}
                                defaultValue={selectFindValue(state['criterion'], nomenclatures)}
                                />
                    </div>
                    <div className="field">
                        <label htmlFor="level"> Niveau hiérarchique </label>
                        <Select id="nomenclature" name="nomenclature" className="form-control" options={levels}
                                onChange={handleLevel}
                                defaultValue={selectFindValue(state['niveau'], levels)}
                                required  isClearable={true}
                                isSearchable={true}/>
                    </div>
                </div>
    <div className="field">
        <label htmlFor="upperUnit"> Territoire supérieur : </label>
        <Select id="nomenclature" name="nomenclature" className="form-control" options={sups}
                isClearable={true}
                onChange={handleSup}
                defaultValue={selectFindValue(state['sup'], sups)}
                isSearchable={true}/>
    </div>
    <div className="two fields">
        <div className="field">
            <label htmlFor="date"> Préciser une date </label> <input type="checkbox" name="dateBool" onChange={handleCheckDate} defaultValue={state["hasDate"]}/>
        </div>
        <div className="field">
            <label htmlFor="conflict"> Inclure versions dépéréciées </label>
            <input type="checkbox" name="conflict" onChange={handleCheckDeprecated} defaultValue={state["include"]}/>
        </div>
    </div>
                {date}
    <input type="submit" name="Search" value="Rechercher" className="ui btn btn-primary"
                className="submit"/>
</form>
            <br />
            <br />
            <Tree
                contents={tree}
                className={Classes.ELEVATION_0}
                onNodeDoubleClick={async (e)=>{
                    //TODO open Href
                    if (e.id!=undefined && !e.hasCaret){
                        window.open("/fiche?unit="+e.id.split("#")[1],"_self")
                    }
                }

                }
                onNodeExpand={async (e)=>{
                    e.isExpanded=true;
                    setTree(tree);
                    setIsOpen({...isOpen, [e.id]: !isOpen[e.id]});
                }}
                onNodeCollapse={(e)=>{
                    console.log(e.id)
                    e.isExpanded=false;
                    setTree(tree);
                    setIsOpen({...isOpen, [e.id]: !isOpen[e.id]});
                }}
            />
        </div>)
    return Page(content)
}
