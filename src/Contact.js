import React, { Component } from 'react';

//Import SMTP.js code from a file
import SmtpService from './SmtpService.js'; 

//Import state abbreviations to generate in the form
import stateAbbreviations from "./stateAbbreviations.js";

//Import 3rd-party packages
import FontAwesome from 'react-fontawesome';

//Detect if in one is in development
let isDev = (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV );
class Contact extends Component  {
    constructor(props) {
        super(props);
    
        this.state = {
            clientName: "",
            companyName: "",
            email: "",
            subject: "",
            phone: "",
            message: "",
            address: "",
            city: "",
            stateUSA: "CA",
            zipcode: "",
            renderMessage: false,
            firstTimeRender: null,
            emailSentSuccess: false,
            isSending : false
        };
    }

    componentDidMount = () => {
        this.setState({firstTimeRender: true});
    };

    generateStateOptions = () => {
       return stateAbbreviations.map(
            (stateObject) => {
                return <option value={stateObject.abbreviation}
       key={stateObject.abbreviation}> {stateObject.name} ( {stateObject.abbreviation} ) </option> 
            }
        );
    }; //end generateStateOptions

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }; //end handleInputChange

    handleChange = (event) => {
        this.setState({stateUSA: event.target.value});
      }

    sendEmail = async (event) => {
        console.log("Sending e-mail...");   
        this.setState({
            isSending : true
        });

        let to = isDev ? "juandavid@jdlondono.com" : "sales@harzatapes.com";
        let from = "juandavid@jdlondono.com";
        //this.state.email;
        let subject = `New Client Message from HarzaTapes.com: ${this.state.subject}`;
        let message = `<strong>Name of Client (Sender)<strong>:\t ${this.state.clientName} ${"\n"} <br/>
                       <strong>Address</strong>:\t ${this.state.address} \n${"\n"} <br/>
                       <strong>City</strong>: \t ${this.state.city} \n${"\n"} <br/>
                       <strong>State</strong>: \t ${this.state.stateUSA} \n${"\n"} <br/>
                       <strong>Company</strong>:\t ${this.state.companyName} \n${"\n"} <br/>
                       <strong>E-mail</strong>:\t ${this.state.email} \n${"\n"} <br/>
                       <strong>Phone</strong>:\t ${this.state.phone} \n <br/>
                       <strong>Message</strong>: \t ${this.state.message} <br/>
                       `
        let sendEmail = SmtpService();
        let emailSuccessMessage = await sendEmail.send({
            SecureToken : process.env.REACT_APP_SMTPJS_CRED,
            To : to,
            From : from,
            Subject : subject,
            Body : message
        });
       
        if (emailSuccessMessage === "OK") {
            this.setState({
                emailSentSuccess: true,
                isSending: false
            });
            
        } 
        
        if (emailSuccessMessage && emailSuccessMessage !== "OK") {
            console.log(emailSuccessMessage);
            this.setState({
                emailSentSuccess: false,
                isSending : false
            }); 
        }
    };

    formValidate = (event) => {
        event.preventDefault();
        this.setState({ firstTimeRender : false });
        if (this.state.clientName && this.state.email &&
            this.state.subject && this.state.subject
            ) {
                this.setState({
                    renderMessage : false
                });
                console.log("True to sendEmail");
                this.sendEmail(event);
        } else {
            this.setState({
                renderMessage : true
            });
            console.log("Could not validate");
        }
    }; //end formValidate()

    resetForm = () => {
        this.setState({
            clientName: "",
            companyName: "",
            email: "",
            subject: "",
            phone: "",
            message: "",
            address: "",
            city: "",
            stateUSA: "",
            zipcode: "",
            emailSent: false,
            firstTimeRender: true,
            isSending : false
        });
    };

    render = () => {
        return (
            <section className="contact-container container">
                <form onSubmit={(e) => this.formValidate(e) } method="POST" >
                    <fieldset>
                        <legend className="form-legend">Contact Us</legend>
                        <div className="qr-code-row row">
                            <div className="col-md-6">
                                <section>
                                    <h5>By e-mail:</h5>
                                    <p className="extraContactInfo">
                                        <FontAwesome name='envelope' 
                                                    className="quote-phone-icon" 
                                        />
                                        <a href="mailto:sales@harzatapes.com">
                                            sales@harzatapes.com
                                        </a>
                                    </p>
    
                                    <p className="extraContactInfo">
                                        <FontAwesome name='map' 
                                            className="quote-phone-icon" 
                                        /> 
                                        <a 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.google.com/maps/place/Harza+Tapes/@33.966971,-118.0669307,17z/data=!3m1!4b1!4m5!3m4!1s0x80c2d3b53a9cf309:0x3a23927fc824b33f!8m2!3d33.966971!4d-118.064742">
                                            8237 Allport Ave
                                            Santa Fe Springs,
                                            CA 90670
                                        </a>
                                    </p>
                                    <p className="extraContactInfo">
                                        <a href="tel:(562) 696-0282">  
                                            <FontAwesome name='phone' 
                                                         className="quote-phone-icon" 
                                            /> (562) 696-0282 
                                        </a>
                                    </p>
                                    <p className="extraContactInfo">
                                        <a href="fax:(509) 471-0282">
                                            <FontAwesome name='fax' 
                                                         className="quote-phone-icon" 
                                            /> (509) 471-0282 
                                        </a>
                                    </p>
                                </section>
                            </div>
                            <div className="col-md-3">
                                <figure className="qrCode-figure">
                                    <img src="./assets/img/contactUs-QRcode.jpg" id="harza-qr-code" className="img-fluid" alt="Harza Tapes QR Code" />
                                    <figcaption>Scan and save our <br/> info on your cellphone</figcaption>
                                </figure>
                            </div>
                            <div className="col-md-3">
                                <img src="./assets/img/deal.png" alt="Deal" id="deal-image" className="img-fluid" />
                            </div>
                        </div>
                        <div className="contactContainerForm-row row">
                            <div className="col-md-6">
                                <p id="requiredText">
                                    Required<abbr title="required" className="form-asterisk">*</abbr>
                                </p>

                                <p className="form-field">
                                    <label className="form-field-label">Your name: 
                                        <abbr title="required" className="form-asterisk">*</abbr>
                                    </label>
                                    <input className="form-field-input" 
                                           type="text" 
                                           id="clientName"
                                           name="clientName"
                                           onChange={this.handleInputChange}
                                           value={this.state.clientName}
                                    />
                                    <div className="form-errorMessage">{ (this.state.firstTimeRender === false) ? 
                                                                           ( ( this.state.clientName && !this.state.renderMessage ) ? 
                                                                                " " : "Please input your name."
                                                                           ) : "" }
                                    </div>
                                </p>
                                <p className="form-field">
                                    <label className="form-field-label">
                                        Company Name:
                                    </label>
                                    <input className="form-field-input" 
                                           type="text" 
                                           id="companyName"
                                           name="companyName"
                                           onChange={this.handleInputChange}
                                           value={this.state.companyName}
                                    />
                                </p>
                                <p className="form-field">
                                    <label className="form-field-label">Phone Number: 
                                        <abbr title="required" className="form-asterisk">*</abbr>
                                    </label>
                                    <input className="form-field-input" 
                                           type="number" 
                                           id="phone"
                                           name="phone"
                                           onChange={this.handleInputChange}
                                           value={this.state.phone}
                                    />
                                    <div className="form-errorMessage">{ (this.state.firstTimeRender === false) ? 
                                                                           ( ( this.state.phone && !this.state.renderMessage ) ? 
                                                                                " " : "Please input your phone number."
                                                                           ) : "" }
                                    </div>
                                </p>
                                <p className="form-field">
                                    <label className="form-field-label">E-mail: 
                                        <abbr title="required" className="form-asterisk">*</abbr>
                                    </label>
                                    <input className="form-field-input" 
                                           type="email" 
                                           id="email"
                                           name="email"
                                           onChange={this.handleInputChange}
                                           value={this.state.email}
                                    />
                                    <div className="form-errorMessage">{ (this.state.firstTimeRender === false) ? 
                                                                           ( ( this.state.email && !this.state.renderMessage ) ? 
                                                                                " " : "Please input your e-mail."
                                                                           ) : "" }
                                    </div>
                                </p>
                                <p className="form-field">
                                    <label className="form-field-label">Subject: 
                                        <abbr title="required" className="form-asterisk">*</abbr>
                                    </label>
                                    <input className="form-field-input" 
                                           type="text" 
                                           id="subject"
                                           name="subject"
                                           onChange={this.handleInputChange}
                                           value={this.state.subject}
                                    />
                                      <div className="form-errorMessage">{ (this.state.firstTimeRender === false) ? 
                                                                           ( ( this.state.subject && !this.state.renderMessage ) ? 
                                                                                " " : "Please input your subject."
                                                                           ) : "" }
                                    </div>
                                </p>
                                <p className="form-field">
                                    <label className="form-field-label">Message: 
                                        <abbr title="required" className="form-asterisk">*</abbr>
                                    </label>
                                    <textarea rows="5" cols="45"
                                                id="message"
                                                name="message"
                                                onChange={this.handleInputChange}
                                                value={this.state.message}
                                    />
                                   <div className="form-errorMessage">{ (this.state.firstTimeRender === false) ? 
                                                                           ( ( this.state.message && !this.state.renderMessage ) ? 
                                                                                " " : "Please input your message."
                                                                           ) : "" }
                                    </div>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <div className="form-field">
                                    <p className="form-field-message">
                                    Include only if you wish to receive by
                                    mail one <br/> FREE roll of our Printed Sealing
                                    Tape 
                                    </p>
                                    <label className="form-field-label">
                                        Address: 
                                    </label>
                                    <input className="form-field-input" 
                                           type="text" 
                                           id="address"
                                           name="address"
                                           value={this.state.address}
                                           onChange={this.handleInputChange}
                                    />                        
                                </div>
                                <p className="form-field">
                                    <label className="form-field-label">
                                        City: 
                                    </label>
                                    <input className="form-field-input" 
                                           type="text" 
                                           id="city"
                                           name="city"
                                           value={this.state.city}
                                           onChange={this.handleInputChange}
                                    />                        
                                </p>
                                <p className="form-field">
                                    <label className="form-field-label">
                                        State: 
                                    </label>
                                    <select value={this.state.stateUSA}
                                            defaultValue={{label: " California ( CA ) ", value: "CA"}}
                                            onChange={this.handleChange}
                                    > 
                                        { this.generateStateOptions() }
                                    </select>                       
                                </p>
                                <p className="form-field">
                                    <label className="form-field-label">
                                        ZipCode: 
                                    </label>
                                    <input  className="form-field-input" 
                                            type="number" 
                                            id="zipcode"
                                            name="zipcode"
                                            value={this.state.zipcode}
                                            onChange={this.handleInputChange}/>                        
                                </p>
                                <p className="form-field">
                                    <button type="submit">Send</button>
                                    <button type="reset" id="reset-button" onClick={this.resetForm}>Reset</button>
                                </p>
                                <div>
                                    <p id={ !this.state.firstTimeRender ? 
                                            ( (this.state.emailSentSuccess === true) && !this.state.firstTimeRender && (this.state.isSending === false)
                                                ? "form-successMessage" : 
                                                (!this.state.emailSentSuccess) && (this.state.isSending === true) ? "form-loadingMessage"
                                                            : "form-errorMessage") 
                                            : ""}
                                    > { !this.state.firstTimeRender && (this.state.isSending !== null) ? 
                                            (this.state.emailSentSuccess && !this.state.firstTimeRender && (this.state.isSending === false)
                                                ? `E-mail sent successfuly ${String.fromCharCode(10004)}` : 
                                                (this.state.emailSentSuccess !== "OK") && (this.state.isSending === true) ? "Sending e-mail..."
                                                    : `Sending e-mail failed ${String.fromCharCode(215)}` ) 
                                        : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
 
                    </fieldset>
                </form>
            </section>
        );
    }
};

export default Contact;