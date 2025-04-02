/* eslint-disable indent */

import React from 'react'; 
import TeacherCertificate from "../../assets/img/image1.png";
class TCertificate extends React.Component { 
    constructor(props) { 
        super(props); 
        this.state = {}; 
        console.log(props,"ppp");
    } 
    render() { 
        return (
            <div>
            
            <div style={{ width: '100%', margin: 0, padding: 0 , overflow: 'hidden',}}> 
                <div className="row" > 
                    <div> 
                        {/* <span 
                            className="text-capitalize" 
                            style={{ 
                                position: 'absolute', 
                                top: '8rem', 
                                left: '20rem',
                                fontSize: '3rem',
                                fontWeight:"bold",
                                color:"#DA220C",
                                fontFamily: 'Times New Roman' 
                            }} 
                        > 
                            {this.props.full_name} 
                        </span> */}
                        <span 
                            className="text-capitalize" 
                            style={{ 
                                position: 'absolute', 
                                top: '20rem', 
                                left: '20rem',
                                fontSize: '3rem',
                                fontWeight:"bold",
                                color:"#DA220C",
                                fontFamily: 'Times New Roman' 
                            }} 
                        > 
                            {this.props.data} 
                        </span> 
                        <img 
                            src={TeacherCertificate} 
                            alt="certificate" 
                          
                            style={{ 
                                width: '1150px',  
                                height: '750px',  
                            }} 
                        /> 
                    </div> 
                </div> 
            </div>
            </div>  
        ); 
    } 
} 

export default TCertificate;
