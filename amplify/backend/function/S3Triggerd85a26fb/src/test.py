import os
fileName=os.path.basename('public/jobOutput/us-west-2-383e04b2-8692-4883-a617-da15b6df5ea7/us-west-2-383e04b2-8692-4883-a617-da15b6df5ea7-very-short.m4a.json')

jobId = fileName.replace(".json","")

print(jobId)