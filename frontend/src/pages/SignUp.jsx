import React, { useState } from 'react'
import arrow from  '/images/backarrow.png'
import './signup.css'

const SignUp = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
 
  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
 
  // Handling the name change
  const handleName = (e) => {
    setName(e.target.value);
    setSubmitted(false);
  };
 
  // Handling the email change
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };
 
  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };

  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setSubmitted(false);
  };
 
  // Handling the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === '' || email === '' || password === '' || cpassword === '' || password !== cpassword) {
      setError(true);
    } else {
      setSubmitted(true);
      setError(false);
    }
  };
 
  // Showing success message
  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
        <h1>User {name} successfully registered!!</h1>
      </div>
    );
  };
 
  // Showing error message if error is true
  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>Please enter all the fields</h1>
      </div>
    );
  };

  return (
    <div className="container">
        <div className="header">
            <button><img src={arrow} /><h1>Back</h1></button>
        </div>
        <div className='title'>
              <h1>User Registration</h1>
            </div>
        <div className="form">
        <div className="messages">
          {errorMessage()}
          {successMessage()}
        </div>
 
        <form>
          {/* Labels and inputs for form data */}
          <label className="label">Name</label>
          <input onChange={handleName} placeholder="Please enter your name" className="input"
            value={name} type="text" />
    
          <label className="label">Email</label>
          <input onChange={handleEmail} placeholder="Please enter your email" className="input"
            value={email} type="email" />
    
          <label className="label">Password</label>
          <input onChange={handlePassword} placeholder="Please enter your password" className="input"
            value={password} type="password" />

          <label className="label">Confirm Password</label>
          <input onChange={handleCPassword} placeholder="confirm your password" className="input"
            value={cpassword} type="password" />
    
          <button onClick={handleSubmit} className="btn" type="submit">
            Register
          </button>
        </form>
    </div>
    </div>
  )
}

export default SignUp