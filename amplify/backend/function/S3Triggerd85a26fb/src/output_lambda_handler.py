import os
import boto3
import datetime
import boto3
import json


s3_client=boto3.client('s3')

def convert_single_speaker_transcript(infile,outfile):
    print ("Filename: ", infile)
    with open(outfile,'w+') as w:
	    with open(infile) as f:
		    data=json.loads(f.read())
		    items = data['results']['items']
		    speaker_start_time = items[0]['start_time']
		    line=speaker_start_time + ': ' + data['results']['transcripts'][0]['transcript']
		    w.write(line + '\n\n')

def convert_multiple_speaker_transcript(infile,outfile):
    print ("Filename: ", infile)
    with open(outfile,'w+') as w:
	    with open(infile) as f:
		    data=json.loads(f.read())
		    labels = data['results']['speaker_labels']['segments']
		    speaker_start_times={}
		    for label in labels:
			    for item in label['items']:
				    speaker_start_times[item['start_time']] =item['speaker_label']
		    items = data['results']['items']
		    lines=[]
		    line=''
		    time=0
		    speaker='null'
		    i=0
		    for item in items:
			    i=i+1
			    content = item['alternatives'][0]['content']
			    if item.get('start_time'):
				    current_speaker=speaker_start_times[item['start_time']]
			    elif item['type'] == 'punctuation':
				    line = line+content
			    if current_speaker != speaker:
				    if speaker:
					    lines.append({'speaker':speaker, 'line':line, 'time':time})
				    line=content
				    speaker=current_speaker
				    time=item['start_time']
			    elif item['type'] != 'punctuation':
				    line = line + ' ' + content
		    lines.append({'speaker':speaker, 'line':line,'time':time})
		    sorted_lines = sorted(lines,key=lambda k: float(k['time']))
		    for line_data in sorted_lines:
			    line='[' + str(datetime.timedelta(seconds=int(round(float(line_data['time']))))) + '] ' + line_data.get('speaker') + ': ' + line_data.get('line')
			    w.write(line + '\n\n')

def handle_output(bucket, key, outputPrefix, speakers):
    fileName=os.path.basename(key)
    txtfile=outputPrefix+fileName+'.txt'
    download_path = '/tmp/{}'.format(fileName)
    upload_path = '/tmp/{}.txt'.format(fileName)
    s3_client.download_file(bucket,key,download_path)
    if speakers>1:
	    convert_multiple_speaker_transcript(download_path,upload_path)
    else:
	    convert_single_speaker_transcript(download_path,upload_path)
    s3_client.upload_file(upload_path, '{}'.format(bucket), txtfile)
    return txtfile
