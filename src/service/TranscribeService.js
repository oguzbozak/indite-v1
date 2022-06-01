import {
    API,
    Storage,
    graphqlOperation
} from 'aws-amplify'

import { createTranscribe, deleteTranscribe } from '../graphql/mutations'
import { listTranscribes } from '../graphql/queries'

import { Auth } from 'aws-amplify';

const inputPrefix = 'input'
const level = 'public'
class TranscribeService {

    async listAll() {
        let creds = await Auth.currentUserCredentials()
        let identity = creds.identityId.replace(':', '-')

        const transcribeData = await API.graphql(graphqlOperation(listTranscribes))
        const transcribes = transcribeData.data.listTranscribes.items

        for(var transcribe of transcribes){
            transcribe.inputFileLink = await Storage.get(
                transcribe.inputFile.substring(level.length+1),
                {
                    level: 'public'
                },
            )

            transcribe.inputFileName = transcribe.inputFile.substring(transcribe.inputFile.lastIndexOf(identity)+identity.length+1)

            if(transcribe.downloadable){
                transcribe.downloadableLink = await Storage.get(
                    transcribe.downloadable.substring(level.length+1),
                    {
                        level: level
                    },
                )
                transcribe.downloadableFileName = transcribe.downloadable.substring(transcribe.downloadable.lastIndexOf(identity)+identity.length+1)
            }


        }
        return transcribes;
    }

    async delete(id) {
        const transcribe = { id: id}
        await API.graphql(graphqlOperation(deleteTranscribe, {input: transcribe}))
    }

    async insertTranscribe(file, speakers, language) {
        let creds = await Auth.currentUserCredentials()
        let identity = creds.identityId.replace(':', '-')

        let id = `${identity}-${file.name}`

        let key = `${inputPrefix}/${identity}/${id}`
        await Storage.put(key, file, {
            level: 'public',
            progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
            },
        })
    
        const transcribe = { id : id,  speakers: speakers, language: language, inputFile: 'public/'+key, state: 'created'}    
        await API.graphql(graphqlOperation(createTranscribe, { input: transcribe }))
    }
}

export default new TranscribeService()