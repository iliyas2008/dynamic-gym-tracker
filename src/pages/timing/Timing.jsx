import React from 'react'
import { Link } from 'react-router-dom'
import { useDarkMode } from "../../hooks/UseDarkMode";

const Timing = () => {
  const { dark } = useDarkMode()

  return (
    <div className="container py-2">
      <div className="row">
        <div className="col">
          <nav aria-label="breadcrumb" className={`${dark ? 'text-white bg-dark' : 'bg-light'} rounded-3 p-3 mb-4`}>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Timing
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Timing