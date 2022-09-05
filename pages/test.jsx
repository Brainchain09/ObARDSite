import React from 'react'
import Page from './page.js'

export default () => {

    const data = {before: ["A", "B", "C", "D"], change: 'Explosion', after: ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP"]};

    function genColumns(numRow, rs) {

        let columns = [];
        console.log("row:"+(numRow)); console.log("rs:"+rs);
        if ((numRow) % rs === 0) {

            if (data.before.length > data.after.length) {

                console.log("data:"+data.after[numRow/rs]);
                columns.push(

                    <>

                        <td>{data.before[numRow]}</td>
                        <td rowspan={rs}>{data.after[numRow/rs]}</td>

                    </>

                )

            } else {

                console.log("data:"+data.before[numRow/rs]);
                columns.push(

                    <>

                        <td rowspan={rs}>{data.before[numRow/rs]}</td>
                        <td>{data.after[numRow]}</td>

                    </>

                )

            }

        } else {

            if (data.before.length > data.after.length) {

                columns.push(<td>{data.before[numRow]}</td>)

            } else {

                columns.push(<td>{data.after[numRow]}</td>)

            }

        }

        return columns;

    }

    function genRows(numRow) {

        const rowspan = (data.before.length > data.after.length) ?
            data.before.length : data.after.length;

        const rsRound = (data.before.length > data.after.length) ?
            Math.ceil(data.before.length/data.after.length) :
            Math.ceil(data.after.length/data.before.length)

        let rows = [];
        if (numRow === 0) {

            if (data.before.length > data.after.length) {

                rows.push(

                    <tr>

                        <td>{data.before[0]}</td>
                        <td rowSpan={rowspan}>{data.change} ➡️</td>
                        <td rowSpan={rsRound}>{data.after[0]}</td>

                    </tr>

                )

            } else {

                rows.push(

                    <tr>

                        <td rowSpan={rsRound}>{data.before[0]}</td>
                        <td rowSpan={rowspan}>{data.change} ➡️</td>
                        <td>{data.after[0]}</td>

                    </tr>

                )

            }

        } else {

            rows.push(<tr>{genColumns(numRow, rsRound)}</tr>);

        }

        return rows;

    }

    function body() {

        let body = [];
        console.log(data);
        const lines = (data.before.length > data.after.length) ?
            data.before.length : data.after.length;

        for (let i = 0; i < lines; i++) {

            body.push(genRows(i))

        }

        return (

            <>

                <h1 className="text-center mt-2">Mettre le titre de la page ici</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Nom du ou des territoires</th>
                            <th>Nom du changement</th>
                            <th>Nom du ou des nouveau(x) territoires</th>
                        </tr>
                    </thead>
                    {body}
                </table>

            </>

        )

    }

    return Page(body())

}
