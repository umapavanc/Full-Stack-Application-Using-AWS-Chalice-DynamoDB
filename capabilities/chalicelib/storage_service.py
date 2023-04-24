from botocore.exceptions import ClientError
from datetime import datetime
import uuid
import boto3
import json

class S3StorageService:
    def __init__(self, storage_location):
        self.client = boto3.client('s3')
        self.bucket_name = storage_location

    def get_storage_location(self):
        return self.bucket_name

    def upload_file(self, file_bytes, file_name):
        print(self.bucket_name)
        self.client.put_object(Bucket = self.bucket_name,
                               Body = file_bytes,
                               Key = file_name,
                               ACL = 'public-read')

        return {'fileId': file_name,
                'fileUrl': "http://" + self.bucket_name + ".s3.amazonaws.com/" + file_name}


class DynamoDBService:
    def __init__(self): #dyn_resource
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table('DS_Leads')

    def timestamp_generator(self):
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # This method take lead input as json object
    def insert_lead(self, lead):
        print(lead)
        try:
            # Prepare the item for insertion into DynamoDB
            item = {
                "LeadId": str(uuid.uuid4()),
                "userId": lead['userId'],            
                "Name": lead['Name'],
                "CompanyName": lead['CompanyName'],
                "CompanyAddress": lead['CompanyAddress'],
                'PostalCode': lead['PostalCode'],
                #"CompanyURL": '',
                "Email": lead['Email'],
                #"Gender": '',
                "LeadSource": 'Advertisement',
                "PhoneNo": lead['PhoneNo'],
                "Status": 'Open - Not Contacted',
                "Timestamp": self.timestamp_generator(),
                "LastUpdatedTime": self.timestamp_generator()
            }
            print(item)
            # If the input is object, timestamp code must be added in app.py file as object else if we're preparing the input object in endpoint have it here.
            response = self.table.put_item(
                Item = item
            )
            print(response)            
        except ClientError as err:
            print("Couldn't create lead in table %s. Here's why: %s: %s",
                self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            # raise
            return {
                'statusCode': 500,
                'body': json.dumps({'success': 'Failed to add lead'})
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps({'error': 'Lead added successfully'})
            }

    # This method take lead input as json object
    def insert_multiLeads(self, items):
        try:
            # Define the batch write request as a dictionary
            batch_write_request = {
                self.table: [
                    {
                        'PutRequest': {
                            'Item': item
                        }
                    } for item in items
                ]
            }

            # Call the batch_write_item method to insert the items
            response = self.dynamodb.batch_write_item(RequestItems=batch_write_request)

            # Print the response
            print(response)           
        except ClientError as err:
            print("Couldn't create leads in table %s. Here's why: %s: %s",
                self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            # raise
            return {
                'statusCode': 500,
                'body': json.dumps({'success': 'Failed to add leads'})
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps({'error': 'Leads added successfully'})
            }


    def get_leads(self):
        try:
            # scan() function Consume lot of read capacity units
            response = self.table.scan()
            # filter expression is helpful to filter based on attributes
            # response = table.scan(FilterExpression=Attr('UserId').eq("1"))
        except ClientError as err:
            print("Couldn't fetch leads in table %s. Here's why: %s: %s",
                self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            # raise
            return {
                'statusCode': 500,
                'body': json.dumps({'success': 'Failed to fetch leads'})
            }
        else:
            return {
                'statusCode': 200,
                'body': response['Items']
            }
    
    def read_item(self, leadId,):
        try:
            response = self.table.get_item(
                Key = {
                'LeadId': leadId
                }
            )
        except ClientError as err:
            print("Couldn't fetch lead %s in table %s. Here's why: %s: %s",
                leadId, self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            return response #['Item']
        
    # This method should be modified according to the columns that have to get updated but now
    # it only updates status attribute/column
    def update_lead(self, lead):
        try:
            update_expression = 'SET #name = :name, #company_name = :company_name, #company_address = :company_address, #postal_code = :postal_code, #email = :email, #phone_no = :phone_no, #last_updated_time = :last_updated_time'
            expression_attribute_names = {'#name': 'Name',
                                        '#company_name': 'CompanyName',
                                        '#company_address': 'CompanyAddress',
                                        '#postal_code': 'PostalCode',
                                        '#email': 'Email',
                                        '#phone_no': 'PhoneNo',
                                        '#last_updated_time': 'LastUpdatedTime'}
            expression_attribute_values = {':name': lead['Name'],
                                            ':company_name': lead['CompanyName'],
                                            ':company_address': lead['CompanyAddress'],
                                            ':postal_code': lead['PostalCode'], 
                                            ':email': lead['Email'], 
                                            ':phone_no': lead['PhoneNo'], 
                                            ':last_updated_time': self.timestamp_generator()}
            response = self.table.update_item(
                Key = {'LeadId': lead['LeadId']},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="UPDATED_NEW"
            )
            print(response)
        except ClientError as err:
            print("Couldn't update lead %s in table %s. Here's why: %s: %s",
                lead['LeadId'], self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            # raise
            return {
                'statusCode': 500,
                'body': json.dumps({'success': 'Failed to update lead'})
            }
        else:
            return {
                'statusCode': 200,
                'body': response['Attributes']
            }
    
    def delete_lead(self, lead):
        try:
            response = self.table.delete_item(
                Key = {'LeadId': lead['LeadId']}
            )
            print(response)
        except ClientError as err:
            print("Couldn't update lead %s in table %s. Here's why: %s: %s",
                lead['LeadId'], self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            return {
                'statusCode': 200,
                'body': response
            }

