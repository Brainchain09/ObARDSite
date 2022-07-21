import Link from 'next/link'
import React from 'react'
import Head from 'next/head'




export default class dataFiche extends React.Component {
    render() {
        let keys=Object.keys(this.props.content)
        return (<div className="container">
        <div className="row">
            <div className="col-1 align-self-center">
            </div>

            <div className="col-10">
                <section className="card  col align-self-center">
                    <div className="card-body">
                        <h2 className="text-center card-title"> {this.props.title} </h2>
                        <br/>
                        <br/>
                        <table className="identityData">
                            {keys.map(key=> <tr>
                                    <td> {key+" :"} </td>
                                    <td> {this.props.content[key]} </td>
                                </tr>)}
                        </table>

                    </div>

                </section>
            </div>

        </div>
    </div>)
}
}
