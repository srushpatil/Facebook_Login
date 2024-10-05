import React from 'react'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
        <a className="navbar-brand" href="/data">Facebook</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto my-auto">
            <li className="nav-item">
            <a className="nav-link" aria-current="page" href="/data">Home</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/data">About</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/data">Contact</a>
            </li>
        </ul>
        </div>
    </div>
    </nav>
  )
}
