import Link from 'next/link'
import React, {useState} from 'react'
import Head from 'next/head'
import Page from './page.js'

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

import Tooltip from 'rc-tooltip'
import {
    fetcherCriteres,
    fetcherNiveaux, fetcherNiveauxInf,
    fetcherNiveauxSup,
    getTerritory,
    getTerritoryURI,
    getUnits
} from "../utilities/fetchers";
import Select from "react-select";

const {Handle}=Slider



export async function getServerSideProps(props) {
    let nomenclatures= await fetcherCriteres()

    return {
        props: {
            nomenclatures
    }}
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

export default ({nomenclatures})=>{


    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [image, setImage] = useState(null);
    const [date, setDate]=useState([1661, 1789])
    const [criterion,setCriterion]=useState(null)


    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {

            const i = event.target.files[0]
            setImage(i)
            setCreateObjectURL(URL.createObjectURL(i));
        }
    }

    const uploadToServer = async (event) => {
        event.preventDefault()
        event.preventDefault()
        const body = new FormData();
        body.append("date", date);
        body.append("criterion", criterion['value']);
        body.append("file", image);
        const response = await fetch("/api/file", {
            method: "POST",
            body
        });
    };

    const content= (
        <div>
            <br/>
            <br/>
            <br/>

            <section>
                <h2>Importer des données à travers un fichier CSV</h2>

                <p>

                </p>

                <br/>
                <br/>

                <h5>Format Attendu</h5>
                Les fichiers .csv permettent d'importer rapidement des unités territoriales. Ils doivent être structurés comme suit :
                <br/>
                La première colonne contient l'ID Cassini de la Paroisse, et la seconde son Nom. Les colonnes suivantes fonctionne par paires (ID,nom) et représente les unités supérieures de la paroisse décrite dans cette ligne, par ordre hiérarchique.
                <br/>
                <br/>
                Exemple de ligne de csv : 12456, Nom_Paroisse, 567, Nom_Election, 3, Nom_Generalite
                <br/>
                <br/>
                <div className="field form-group mb-3 notParoisse">
                    <label className="col control-label"> Critère hiérarchique</label>
                    <div className="col inputGroupContainer">
                        <div className="input-group">
                            <Select id="nomenclature" name="nomenclature" className="form-control" options={nomenclatures}
                                    onChange={setCriterion} isClearable={true}
                                    isSearchable={true}
                                    defaultValue={criterion}
                                    required/>
                        </div>
                    </div>
                </div>
                <form className="ui form" encType="multipart/form-data" action="/import" method="post" onSubmit={uploadToServer}>
                    <div >
                        <input type="hidden" name="territory" id="territory" value="1"/>
                        <p className="field territory">
                            <label htmlFor="amount"> Période de validité des données importées</label>
                            <div style={{paddingTop : 30, paddingBottom : 10}}>
                                <Range
                                    min={1661}
                                    max={1789}
                                    onAfterChange={setDate}
                                    defaultValue={date}
                                    allowCross={false}
                                    handle={handle}
                                    tipProps={{visible:true}}
                                />
                            </div>
                        </p>
                    </div>
                    <input type="hidden" name="MAX_FILE_SIZE" value="100000"/>


                    Choisisez le fichier .csv à importer dans le graphe de connaissance <br/>
                    <input type="file" name="monfichier" onChange={uploadToClient}/>

                    <br/>
                    <input type="submit" name="Importer" value="Importer"/>
                </form>

                <div className="information">

                </div>

            </section>

        </div>
    )
    return Page(content)
}
