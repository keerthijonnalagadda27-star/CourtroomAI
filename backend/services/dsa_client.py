#this file calls our java microservice. python backend talks to java backend over HTTP

import requests #used for getting http requests
import os

JAVA_SERVICE_URL=os.getenv("JAVA_SERVICE_URL","http://localhost:8001")

def get_precedents(question:str)->list:
    try:
        response=requests.post(
            f"{JAVA_SERVICE_URL}/dsa/precedents",
            json={"question":question},
            timeout=5 #waiting for 5 secs ..if java doesnt respond..stop waiting..
        )
        if response.status_code==200:
            data=response.json()
            return data.get("precedents",[]) #returns found precedents or if not ,returns empty list
        return []
    except Exception as e:
        print(f"DSA service unavailable: {e}")
        return []
    
def search_ipc(query:str)->list:
    try:
        response=requests.get(
            f"{JAVA_SERVICE_URL}/dsa/ipc-search",
            params={"query":query},
            timeout=5
        )
        if response.status_code==200:
            data=response.json()
            return data.get("results",[])
    except Exception as e:
        print(f"DSA service unavailable:{e}")
        return []
