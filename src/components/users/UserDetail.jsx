import { doc, getDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { db } from "../../firebase-config";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const { dark } = useDarkMode()

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "members", userId);
      try {
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          setUser(docSnap.data());
        }else{
          console.log("Document does not exists !");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userId]);

  function getBloodGroupValue(keyString) {
    switch (keyString) {
      case "o_positive":
        return "O+";
      case "o_negative":
        return "O-";
      case "a_positive":
        return "A+";
      case "a_negative":
        return "A-";
      case "b_positive":
        return "B+";
      case "b_negative":
        return "B-";
      case "ab_positive":
        return "AB+";
      case "ab_negative":
        return "AB-";
      default:
        return "keyString provided is not available !";
    }
  }

  return (
    <section>
      <div className="container py-2">
        <div className="row">
          <div className="col">
            <nav
              aria-label="breadcrumb"
              className={`${dark ? 'bg-dark' : 'bg-light'} rounded-3 p-3 mb-4`}
            >
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/users">Users</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User Details
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className={"col-lg-4"}>
            <div className={`${dark ? 'bg-dark' : 'bg-light'} card mb-4`}>
              <div className="card-body text-center">
                <img
                  src={user?.gymboyAvatar}
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: "150px" }}
                />
                <h5 className={`my-2 ${dark ? 'text-white' : 'text-dark'} text-capitalize`}>{user?.gymboyName}</h5>
                <p className={`text-muted ${ user?.updatedOn ? 'mt-3 mb-2': 'my-2'}`}>
                  {user?.gymboyOccupation}
                </p>
                <p className="text-muted mb-1">
                  {`Joined on ${moment(user?.createdOn?.toDate()).format("LL")}`}
                </p>
                {user?.updatedOn && 
                <p className="text-muted mb-1">
                  {`Updated on ${moment(user?.updatedOn?.toDate()).format("LL")}`}
                </p>
                }
                {/* <div className="d-flex justify-content-center mb-2">
                  <button type="button" className="btn btn-primary">
                    Follow
                  </button>
                  <button type="button" className="btn btn-outline-primary ms-1">
                    Message
                  </button>
                </div> */}
              </div>
            </div>
            {/* <div className="card mb-4 mb-lg-0">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fas fa-globe fa-lg text-warning"></i>
                    <p className="mb-0">https://mdbootstrap.com</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-github fa-lg" style={{color: "#333333"}}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-twitter fa-lg" style={{color: "#55acee"}}></i>
                    <p className="mb-0">@mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i
                      className="fab fa-instagram fa-lg"
                      style={{color: "#ac2bac"}}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i
                      className="fab fa-facebook-f fa-lg"
                      style={{color: "#3b5998"}}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
          <div className="col-lg-8">
            <div className={`${dark ? 'text-white bg-dark' : 'bg-light'} card mb-4`}>
              <div className="card-body">
                <div className={`row  ${ user?.updatedOn && 'my-3'}`}>
                  <div className="col-sm-3">
                    <p className="mb-0">Full Name</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0 text-capitalize">
                      {user?.gymboyName}
                    </p>
                  </div>
                </div>
                <hr />
                <div className={`row  ${ user?.updatedOn && 'my-3'}`}>
                  <div className="col-sm-3">
                    <p className="mb-0">Education</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">
                      {user.gymboyEducation}
                    </p>
                  </div>
                </div>
                <hr />
                <div className={`row  ${ user?.updatedOn && 'my-3'}`}>
                  <div className="col-sm-3">
                    <p className="mb-0">Date of Birth</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">
                      { moment(user?.gymboyBirthday).format("dddd, MMMM D, YYYY") }
                    </p>
                  </div>
                </div>
                <hr />
                <div className={`row  ${ user?.updatedOn && 'my-3'}`}>
                  <div className="col-sm-3">
                    <p className="mb-0">Mobile</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{user?.gymboyMobile}</p>
                  </div>
                </div>
                <hr />
                <div className={`row  ${ user?.updatedOn && 'my-3'}`}>
                  <div className="col-sm-3">
                    <p className="mb-0">Address</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0 text-capitalize">{user?.gymboyAddress}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={`${dark ? 'text-white bg-dark' : 'bg-light'} card mb-4 mb-md-0`}>
                  <div className="card-body">
                    <p className="mb-4">
                      <span className="text-primary font-italic me-1">
                        Personal
                      </span>{" "}
                      details
                    </p>
                    <div className="row mb-3 justify-content-around">
                      <div className="col-sm-6">
                        <p className="mb-0">Age</p>
                      </div>
                      <div className="col-sm-5">
                        <p className="text-muted mb-0">
                          {moment().diff(user?.gymboyBirthday, 'years')}
                        </p>
                      </div>
                    </div>
                    <div className="row mb-3 justify-content-around">
                      <div className="col-sm-6">
                        <p className="mb-0">Blood Group</p>
                      </div>
                      <div className="col-sm-5">
                        <p className="text-muted mb-0">
                          {getBloodGroupValue(user?.gymboyBloodGroup)}
                        </p>
                      </div>
                    </div>
                    <div className="row mb-3 justify-content-around">
                      <div className="col-sm-6">
                        <p className="mb-0">Height</p>
                      </div>
                      <div className="col-sm-5">
                        <p className="text-muted mb-0">
                          {`${user?.gymboyHeight} cm`}
                        </p>
                      </div>
                    </div>
                    <div className="row mb-3 justify-content-around">
                      <div className="col-sm-6">
                        <p className="mb-0">Weight</p>
                      </div>
                      <div className="col-sm-5">
                        <p className="text-muted mb-0">
                          {`${user?.gymboyWeight} kg`}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`${dark ? 'text-white bg-dark' : 'bg-light'} card mb-4 mb-md-0`}>
                  <div className="card-body">
                    <p className="mb-4">
                      <span className="text-primary font-italic me-1">
                        Health
                      </span>{" "}
                      details
                    </p>
                    <div className="row mb-3">
                      <div className="col-sm-5">
                        <p className="mb-0">Problems</p>
                      </div>
                      <div className="col-sm-5">
                        <p className="text-muted mb-0 text-capitalize">
                          {user?.gymboyProblems}
                        </p>
                      </div>
                    </div>
                    {/* <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                      Backend API
                    </p>
                    <div
                      className="progress rounded mb-2"
                      style={{ height: "5px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "66%" }}
                        aria-valuenow="66"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div> */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDetail;
