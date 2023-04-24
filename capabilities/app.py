from chalice import Chalice
import boto3
import re
import json
import base64
import re

from chalicelib import storage_service
from chalicelib import recognition_service
from chalicelib import translation_service
from chalicelib import medicalComprehend_service
from chalicelib import authentication_service

app = Chalice(app_name='Bussiness_Card_Extractor')
dynamodb = boto3.client('dynamodb', region_name='us-east-1')

storage_location = 'contentcen301211308.aws.ai'
s3_storage_service = storage_service.S3StorageService(storage_location)
dynamodb_service = storage_service.DynamoDBService()
translation_service = translation_service.TranslationService()
recognition_service = recognition_service.RecognitionService(s3_storage_service)
medicalComprehend_service = medicalComprehend_service.ComprehendService()


userId = None
allLeads = None

@app.route('/signUp', methods = ['POST'], cors = True)
def signup():
    request_data = json.loads(app.current_request.raw_body)
    response  = authentication_service.user_signUp(request_data)
    return response
    
        


@app.route('/logIn', methods = ['POST'], cors = True)
def login():
    request_data = json.loads(app.current_request.raw_body)
    global userId
    userId, response = authentication_service.user_signIn(request_data)
    return response
    
        

@app.route('/upload_image', methods = ['POST'], cors = True)
def upload_image():
    """processes file upload and saves file to storage service"""
    request_data = json.loads(app.current_request.raw_body)
    file_name = request_data['filename']
    file_bytes = base64.b64decode(request_data['filebytes'])
    try:
        image_info = s3_storage_service.upload_file(file_bytes, file_name)
    except Exception as e:
        print(e)
        return e


    return image_info


def translate_image_text(image_id,from_lang,to_lang):
    """detects then translates text in the specified image"""
    

    MIN_CONFIDENCE = 80.0

    text_lines = recognition_service.detect_text(image_id)

    translated_lines = []
    for line in text_lines:
        # check confidence
        if float(line['confidence']) >= MIN_CONFIDENCE:
            translated_line = translation_service.translate_text(line['text'], from_lang, to_lang)
            translated_lines.append({
                'text': line['text'],
                'translation': translated_line,
                'boundingBox': line['boundingBox']
            })

    return translated_lines


@app.route('/images/{image_id}/extract-info', methods = ['POST'], cors = True)
def extract_info(image_id):
    img_id = image_id
    request_data = json.loads(app.current_request.raw_body)
    from_lang = request_data['fromLang']
    to_lang = request_data['toLang']
    output = ""
    text = translate_image_text(img_id,from_lang,to_lang)
    text_val = ""
    for i in text:
        text_val+=i['text']+" "
    entities = medicalComprehend_service.entities(text_val,to_lang)
    leadInfo = {}
    for entity in entities:
        if entity['Score'] >= 0.50:
            if entity['Type'] == 'PERSON':
                leadInfo['Name'] = entity['Text']
            elif entity['Type'] == 'ORGANIZATION':
                leadInfo['CompanyName'] = entity['Text']
            elif re.search('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', entity['Text']):
                leadInfo['Email'] = entity['Text']
            elif re.search('^\+?\d{1,3}[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$',entity['Text']):
                leadInfo['PhoneNo'] = entity['Text']
    
    #refEmail = app.current_response.get_cookie()
    #leadInfo['refId'] = refEmail
    print(leadInfo)
    return leadInfo

@app.route('/addLead', methods = ['POST'], cors = True)
def addLead():
    request_data = json.loads(app.current_request.raw_body)
    global userId
    print(userId, request_data)
    if userId is None:
        return {
                'statusCode': 401,
                'body': json.dumps({'Failed': 'Please signin and try again'})
            }
    response  = dynamodb_service.insert_lead(request_data)
    return response

@app.route('/addMultipleLead', methods = ['POST'], cors = True)
def addLead():
    request_data = json.loads(app.current_request.raw_body)
    global userId
    print(userId, request_data)
    if userId is None:
        return {
                'statusCode': 401,
                'body': json.dumps({'Failed': 'Please signin and try again'})
            }
    response  = dynamodb_service.insert_multiLeads(request_data)
    return response

@app.route('/updateLead', methods = ['POST'], cors = True)
def updateLead():
    request_data = json.loads(app.current_request.raw_body)
    print('Executing', request_data)
    response  = dynamodb_service.update_lead(request_data)
    return response

@app.route('/deleteLead', methods = ['POST'], cors = True)
def deleteLead():
    request_data = json.loads(app.current_request.raw_body)
    print('Executing', request_data)
    response  = dynamodb_service.delete_lead(request_data)
    return response

@app.route('/fetchLeads', methods = ['GET'], cors = True)
def retrieveLeads():
    global allLeads
    allLeads  = dynamodb_service.get_leads()
    return allLeads #response
