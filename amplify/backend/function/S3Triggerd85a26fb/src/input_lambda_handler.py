import boto3

transcribe = boto3.client('transcribe')

def create_job(jobName, mediaFileUri, outputBucket, outputPrefix, speakers=1, languageCode='en-US'):

    Settings= dict()
    if speakers>1:
        Settings={
            'ShowSpeakerLabels': True,
            'MaxSpeakerLabels': speakers
        }
    else:
        Settings={
            'ShowSpeakerLabels': False,
        }

    response = transcribe.start_transcription_job(
        
        TranscriptionJobName=jobName,
        LanguageCode=languageCode,
        Media={
            'MediaFileUri': mediaFileUri
        },
        OutputBucketName=outputBucket,
        OutputKey=outputPrefix,
        Settings=Settings,
        Tags=[
            {
                'Key': 'Name',
                'Value': jobName
            },
        ],
    )

    return response