
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

function Dashboard(){

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="grow">

        <Header />

        <div className="container-fluid p-4">

          <div className="row">

            <div className="col-md-4 mb-4">
              <div className="card-box">
                <h5>Total Users</h5>
                <h2>12,540</h2>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card-box">
                <h5>Total Projects</h5>
                <h2>865</h2>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card-box">
                <h5>Revenue</h5>
                <h2>$45,200</h2>
              </div>
            </div>

          </div>

          <div className="card-box">
            <h4>Angular to React Conversion Starter</h4>

            <p>
              This React project was generated based on your Angular dashboard structure.
            </p>

            <p>
              Continue converting Angular modules/components into React components.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
