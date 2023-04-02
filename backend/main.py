from typing import Union

from fastapi import FastAPI,  HTTPException
from pydantic import BaseModel


import simpy
from Applications import SendingApplication,ReceivingApplication
from Channel import UnreliableChannel
from Protocol_rdt2 import *

env=simpy.Environment()

# Populate the simulation environment with objects:


def startpacket(ip,port,blacklist):
    sending_app	  = SendingApplication(env)
    receiving_app = ReceivingApplication(env)
    rdt_sender	  = rdt_Sender(env,ip = ip,port = port)
    rdt_receiver  = rdt_Receiver(env,blacklist = blacklist)
    channel_for_data  = UnreliableChannel(env=env,Pc=0,Pl=0,delay=1,name="DATA_CHANNEL")
    channel_for_ack	  = UnreliableChannel(env=env,Pc=0,Pl=0,delay=1,name="ACK_CHANNEL")
    sending_app.rdt_sender = rdt_sender
    rdt_sender.channel = channel_for_data
    channel_for_data.receiver = rdt_receiver
    rdt_receiver.receiving_app = receiving_app
    # ....backward path...for acks
    rdt_receiver.channel = channel_for_ack
    channel_for_ack.receiver = rdt_sender

    # Run simulation

    env.run(until=20)
    
    




import motor.motor_asyncio

class IP(BaseModel):
    ip:str
    port:str



client = motor.motor_asyncio.AsyncIOMotorClient('token')
db = client.blacklist
collection = db.blacklist

async def fetch_ip(ip):
    document = await collection.find_one({"ip":ip})
    return document
async def fetch_ipone(ip):
    document = await collection.find_one({"ip":ip})
    return document
async def create_ip(todo):
    document = todo
    result = await collection.insert_one(document)
    return document

async def remove_ip(title):
    await collection.delete_one({"ip": title})
    return True

async def fetch_all_ips():
    ips = []
    store = collection.find({})
    async for document in store:
        print(document)
        ips.append({"ip":document.get("ip"),"port":document.get("port")})
        # songs.append(**document)
    return ips

from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

origins=["http://localhost:3000","http://localhost:3001"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods = ['*'],
    allow_headers=['*'],
)


@app.get('/')
async def create_item(item_id: int):
    return {"item_id": item_id}

# @app.get("/api/songs")
# async def get_songs():
#     response = await fetch_all_songs()
#     return response


@app.get("/api/ips/{ip}/{port}")
async def get_ip_by_ip(ip:str,port:str):
    response = await fetch_ip(ip)
    print(response)
    
    # print(response)
    if response:
        if response['port'] == " ":
            return False
        else:
            if response['port'] == port:
                return False
            else:
                return True
    else:
        return True
        

@app.post("/api/ips/", response_model=IP)
async def post_todo(todo: IP):
    response = await create_ip(todo.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")


@app.delete("/api/ips/{title}")
async def delete_todo(title):
    reso = await fetch_ipone(title)
    if reso:

        response = await remove_ip(title)
        if response:
            return "Successfully Whitelisted"
        else:
            return "The given IP address is not in the blacklist"
    else:
        return "The given IP address is not in the blacklist"
@app.get("/api/ips/")
async def get_ips():
    response = await fetch_all_ips()
    return response



@app.post("/api/ipss/")
async def post_todo(todo: IP):
    ip = todo.ip
    port = str(todo.port)
    
    blacklist = []
    response = await fetch_all_ips()
    for i in response:
        blacklist.append(i['ip'])

    startpacket(ip,port,blacklist)
    return {"logs":"hello"}