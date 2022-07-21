import Link from 'next/link'
import React from 'react'
import Head from 'next/head'


export default (content) => (
    <div><nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" aria-label="Third navbar example">
        <div class="container-fluid">
            <a class="navbar-brand" href="/"> ObARDI</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav1" >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="nav1">
            <ul class="navbar-nav me-auto mb-2 mb-sm-0">
                <li class="nav-item">
                    <a class="nav-link "  href="/import">Importer des données </a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="dropdown-insert" data-bs-toggle="dropdown">
                        Ajouter des données </a>
                    <ul class="dropdown-menu">
                        <li> <a class="dropdown-item" href="/insert"> Ajouter une zone géographique </a> </li>
                    </ul>
                </li>

                <li class="nav-item">
                    <a class="nav-link " href="research">Recherche</a>
                </li>

            </ul>

        </div>
    </div>
</nav>

<div class="container body-content">



<section class="container">

    {content}
</section>

<hr/>
<footer>
    <p>© 2021 - L'application Obardi</p>
    <p> <a href="/admin"> Page admin </a> </p>
</footer>
</div>
</div>

)
