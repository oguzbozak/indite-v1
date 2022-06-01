import React, { Component } from 'react'
import TranscribeService from '../service/TranscribeService.js';

class TranscribeComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            file: '',
            speakers: '',
            language: 'tr-TR',
            showSuccessMessage: false,
            hasRegisterFailed: false,
            inserting: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.insertClicked = this.insertClicked.bind(this)
        this.setFile = this.setFile.bind(this)
        this.refreshForm = this.refreshForm.bind(this)

    }

    refreshForm(){
        this.setState({
            file: '',
            speakers: '',
            language: 'tr-TR'
        });
        this.forceUpdate();
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    setFile(event) {
        this.setState(
            {
                [event.target.name]: event.target.files[0]
            }
        )
    }

    insertClicked() {
        TranscribeService.insertTranscribe(
            this.state.file,
            this.state.speakers,
            this.state.language
        ).then(() => {
            this.setState({ showSuccessMessage: true })
            this.props.refreshCallback();
            this.refreshForm()
        }).catch((error) => {
            this.setState({ hasRegisterFailed: true })
            console.log(`Error while inserting new transcribe! ${error}`)
        })
    }

    render() {
        return (
            <section className="w-100 p-4 d-flex justify-content-center pb-4">
                <div className="form">
                    <h1 className="h3 mb-3 fw-normal">New Transcribe</h1>


                    <div className="input-group input-group-default mb-3">
                        <span className="input-group-text" id="number-label">Speakers</span>
                        <input type="number" className="form-control" id="insert-speakers" name="speakers" pattern='[1-9]' defaultValue={this.state.speakers} onChange={this.handleChange} />
                    </div>

                    <div className="input-group input-group-default mb-3">
                        <input type="file" className="form-control" id="insert-file" name="file" accept="audio/*" defaultValue={this.state.file} onChange={this.setFile} />
                    </div>



                    <div className="input-group input-group-default mb-3">
                        <span className="input-group-text" id="language-label">Language</span>
                        <select className="form-control" id="insert-language" name="language" onChange={this.handleChange} defaultValue={this.state.language} >
                            <option value="tr-TR">Turkish</option>
                            <option value="en-US">English</option>
                        </select>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={this.insertClicked}>Insert</button>
                    {this.state.inserting && <div class="loader"></div>}

                    {this.state.hasRegisterFailed && <div className="alert alert-warning">Could not create!</div>}
                    {this.state.showSuccessMessage && <div className="alert alert-info">Successfully created the Transcribe</div>}
                </div>
            </section>
        )
    }
}

export default TranscribeComponent