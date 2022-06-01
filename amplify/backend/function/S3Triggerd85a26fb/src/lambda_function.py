
import os
import boto3
import json
import datetime

import urllib3

import input_lambda_handler
import output_lambda_handler



s3=boto3.client('s3')
transcribe = boto3.client('transcribe')

json.JSONEncoder.default = lambda self,obj: (obj.isoformat() if isinstance(obj, datetime.datetime) else None)


def query(query):
    
    endpoint = os.environ.get('API_INDITE_GRAPHQLAPIENDPOINTOUTPUT', None)
    apiKey = os.environ.get('API_INDITE_GRAPHQLAPIKEYOUTPUT', None)

    headers = {
        "Content-Type": "application/json",
        "X-Api-Key":apiKey
    }

    http = urllib3.PoolManager()
    resp = http.request(
        "POST",
        endpoint,
        body=json.dumps({'query': query}),
        headers=headers
    )

    print(resp.data)

    return resp


def get_job(jobId):
    q = """
        query Transcribe {
            getTranscribe(id: \"%s\") {
                language
                state
                speakers
            }
        }
        """ % (jobId)          
    response = query(q)
    responseJson = json.loads(response.data.decode('utf-8'))
    return responseJson['data']['getTranscribe']

def update_job_state(jobId, state):
    q = """
        mutation UpdateTranscribe {
            updateTranscribe(input: {id: \"%s\", state: \"%s\"}) {
                id
                state
            }
        }
        """ % (jobId,state)          

    print(json.dumps(query(q)))


def update_job_dowloadable_file_and_state(jobId, state, dowwloadable_file_key):
    q = """
        mutation UpdateTranscribe {
            updateTranscribe(input: {id: \"%s\", state: \"%s\", downloadable: \"%s\"}) {
                id
                state
                downloadable
            }
        }
        """ % (jobId,state, dowwloadable_file_key)          

    print(json.dumps(query(q)))

def lambda_handler(event, context):
    for record in event['Records']:
        bucket=record['s3']['bucket']['name']
        key=record['s3']['object']['key']
        directory = os.path.dirname(key)
        fileName=os.path.basename(key)
        if '/input/' in key:  
            jobId = fileName
            inputFileUri = "s3://" + bucket+"/"+key

            
            jobOutputPrefix = directory.replace("input", "jobOutput") + "/"

            print(jobId)
            print(jobOutputPrefix)
            job = get_job(jobId)

            response = input_lambda_handler.create_job(jobName=jobId,mediaFileUri=inputFileUri, outputBucket=bucket, outputPrefix=jobOutputPrefix,speakers=job['speakers'], languageCode=job["language"])

            print(json.dumps(response))

            update_job_state(jobId, "started")
        elif '/jobOutput/' in key:

            jobId = fileName.replace(".json","")
            downloadableOutputPrefix = directory.replace("jobOutput", "downloadableOutput") + "/"

            job = get_job(jobId)
            key = output_lambda_handler.handle_output(bucket,key,downloadableOutputPrefix, speakers=job['speakers'])
            update_job_dowloadable_file_and_state(jobId, "completed", key)
            print("Skipping file: " + key)
        else: 
            print("Skipping file: " + key)