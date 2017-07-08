import React, { Component } from 'react';
import SignupForm from './SignupForm'
class Signup extends Component {
    state = {  }
    render() {
        return (
            <div className="row">
                <div className = "container" >
                    <SignupForm />
                </div>
                    
            </div>
        );
    }
}

export default Signup;