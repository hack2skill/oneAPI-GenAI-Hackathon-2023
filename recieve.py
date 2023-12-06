# Script B

import socket
import sys
import json  # Import the JSON module for serialization

statement = sys.argv[1]
prompt2 = sys.argv[2]


def send_request():
    request = [statement, prompt2]

    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(('localhost', 8888))

    # Serialize the list to a JSON string
    request_json = json.dumps(request)

    # Send the request to the server
    client.send(request_json.encode('utf-8'))

    # Receive the response from the server
    response = client.recv(1024).decode('utf-8')
    print(f"{response}")

    # Close the connection
    client.close()


if __name__ == "__main__":
    send_request()
