import React, {Component} from 'react'
import TranscribeService from '../service/TranscribeService.js';

class ListTranscribesComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            transcribes: [],
            message: null
        }
        this.refreshTranscribes = this.refreshTranscribes.bind(this)
        
    }

    componentDidMount() {
        this.refreshTranscribes();
        setInterval(this.refreshTranscribes,10000);
    }

    refreshTranscribes() {

        TranscribeService.listAll()
            .then((transcribes) => {
                this.setState({transcribes: transcribes})
                //console.log('Successfully loaded!')
            }).catch((error) => {
                console.log(`Error while loading transcribes! ${error}`)
        })
    }
    render() {
        return (
            <div className="container">
                
                <table className="table">
                    <thead>
                    <tr>
                        <th>Language</th>
                        <th>Speakers</th>
                        <th>Input File</th>
                        <th>State</th>
                        <th>Output File</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.transcribes.map(
                            transcribe =>
                                <tr key={transcribe.id}>
                                    <td>{transcribe.language}</td>
                                    <td>{transcribe.speakers}</td>
                                    <td>
                                        <a href={transcribe.inputFileLink} target='_blank'>{transcribe.inputFileName}</a> 
                                    </td>
                                    <td>{transcribe.state}</td>
                                    <td> 
                                        {transcribe.downloadableLink && <a href={transcribe.downloadableLink} target='_blank'>{transcribe.downloadableFileName}</a> }
                                    </td>
                                    <td> 
                                        <a href="#" onClick={()=>TranscribeService.delete(transcribe.id)}>Delete</a>
                                    </td>
                                </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ListTranscribesComponent