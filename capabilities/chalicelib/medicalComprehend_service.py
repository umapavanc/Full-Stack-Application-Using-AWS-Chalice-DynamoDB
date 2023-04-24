import boto3


class ComprehendService:
    def __init__(self):
        self.client = boto3.client('comprehend')
    
    
    def entities(self,text,lang):
        result = self.client.detect_entities(Text=text,LanguageCode=lang)
        return result['Entities']
    
