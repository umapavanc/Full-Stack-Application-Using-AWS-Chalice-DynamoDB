import re
import json
import boto3
import hashlib
import uuid
from chalice import Response



dynamodb = boto3.client('dynamodb', region_name='us-east-1')
'''
E-Mail validation
'''
def validate_email(email):
    # A regular expression to match email addresses
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_existing_user(email):
    """
    Check if the given email is already registered in DynamoDB
    """
    try:
        response = dynamodb.get_item(
            TableName='User_Info',
            Key={
                'email': {'S': email}
            }
        )
        if response.get('Item'):
            return True
        else:
            return False
    except Exception as e:
        print(e)
        return False
    
def is_valid_email(email):
    """
    Validate the email using a regular expression
    """
    email_regex = r"[^@]+@[^@]+\.[^@]+"
    return re.match(email_regex, email)

def is_valid_password(password, confirm_password):
    """
    Validate the password and confirm password
    """
    password_regex = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$"
    if password != confirm_password:
        return False
    elif not re.match(password_regex, password):
        return False
    else:
        return True
    


def user_signUp(request_data):
    
    print(request_data['email'])

    if not is_valid_email( request_data['email']):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid email format'})
            }
    elif is_existing_user( request_data['email']):
        return {
            'statusCode': 409,
            'body': json.dumps({'error': 'User already exists'})
        }
    elif not is_valid_password( request_data['password'],  request_data['confirm_password']):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid password format or passwords do not match'})
        }
    else:
        try: 
            hashed_password = hashlib.sha256(request_data['password'].encode('utf-8')).hexdigest()
            dynamodb.put_item(
                TableName='User_Info',
                Item={
                    'userId' : {'S' : str(uuid.uuid4())},
                    'email': {'S':request_data['email']},
                    'password': {'S':hashed_password},
                    'name': {'S':request_data['name']},
                    'phoneNo': {'S':request_data['phoneNo']},
                    'streetAddress': {'S':request_data['streetAddress']},
                    'city': {'S':request_data['city']},
                    'postalCode': {'S':request_data['postalCode']},
                    'province': {'S': request_data['province']},
                    'country': {'S': 'Canada'}
                })
            return {
                'statusCode': 200,
                'body': json.dumps({'success': 'User signed up successfully'})
            }
        except Exception as err:
            print(err)
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to sign up user'})
            }
        
def authenticate_user(email, password, remember_me = False):
    """
    Authenticate the user by comparing the password hash in DynamoDB
    """
    try:
        response = dynamodb.get_item(
            TableName='User_Info',
            Key={
                'email': {'S': email}
            },
            ProjectionExpression='password,userId'
        )
        if response.get('Item'):
            hashed_password = response['Item']['password']['S']            
            if hashed_password == hashlib.sha256(password.encode('utf-8')).hexdigest():
                if remember_me:
                    # Store email in a cookie to remember the user
                    # Response(body="Email ").set_cookie('email', email, secure=True, max_age=86400)
                    print('Cookie')
                return response['Item']['userId']['S']
            else:
                return None
        else:
            return None
    except Exception as e:
        print(e)
        return None
    

def user_signIn(request_data):
    email = request_data['email']
    password = request_data['password']
    remember_me = request_data['remember_me']
    userId = authenticate_user(email,password,remember_me)
    if userId:
        response = {
            'statusCode': 200,
            'body': userId
        }
        return userId, response

    else:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Failed to log in due to invalid email or password'})
        }