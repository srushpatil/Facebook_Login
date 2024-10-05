import React from 'react'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="/data">Facebook</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto my-auto">
            <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/data">Home</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="/data">About</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="/data">Contact</a>
            </li>
        </ul>
        </div>
    </div>
    </nav>
  )
}
