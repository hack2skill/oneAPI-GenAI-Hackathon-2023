# Script A

import socket
import threading
from transformers import AutoModelForCausalLM, AutoTokenizer
import sys

def handle_client(client_socket, data_queue):
    request = client_socket.recv(1024).decode('utf-8')
    print(f"Received request: {request}")

    # Process the request (You can replace this with your actual logic)
    response = "ok"
    device = "cpu"


    def find_nth_occurrence(text, target, n):
        count = 0
        index = -1

        while count < n:
            index = text.find(target, index + 1)

            if index == -1:
                break  # Target not found

            count += 1

        return index


    target_string = "[/INST]"
    nth_occurrence = 2

    
    messages = [
        {"role": "user", "content": "I need some assistance in IT"},
        {"role": "assistant", "content": request[0]},
        {"role": "user", "content": request[1]}

    ]
    encodeds = tokenizer.apply_chat_template(messages, return_tensors="pt")
    # model.save_pretrained()
    model_inputs = encodeds.to(device)
    model.to(device)
    generated_ids = model.generate(
    model_inputs, max_new_tokens=1000, do_sample=True)
    decoded = tokenizer.batch_decode(generated_ids)
    result = find_nth_occurrence(decoded[0], target_string, nth_occurrence)
    print(decoded[0][result+7:])

    # Send the response back to the client
    client_socket.send(response.encode('utf-8'))

    # Close the connection
    client_socket.close()


def start_server(data_queue):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(('localhost', 8888))
    server.listen(5)
    tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")
    model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")
    print("Server listening on port 8888...")

    while True:
        client, addr = server.accept()
        print(f"Accepted connection from {addr[0]}:{addr[1]}")
        client_handler = threading.Thread(
            target=handle_client, args=(client, data_queue))
        client_handler.start()


if __name__ == "__main__":
    data_queue = []
    start_server(data_queue)
