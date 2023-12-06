import sys
import subprocess

statement = [sys.argv[1],sys.argv[2]]



def run_script_b():
    # Replace with the actual path to your Script B
    script_b_path = 'recieve.py'

    # You can pass command-line arguments to Script B as a list
    script_b_arguments = [statement2, statement]

    # Use subprocess to run Script B
    process = subprocess.Popen(['/usr/bin/python3', script_b_path] + script_b_arguments,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for the process to finish and get the return code
    return_code = process.wait()

    # Check if Script B was successful
    if return_code == 0:
        pass

 # print("Script B executed successfully.")
    else:
        print(f"Script B failed with return code: {return_code}")

    # Capture and print the output of Script B
    output, error = process.communicate()

    print(output.decode('utf-8'))


if __name__ == "__main__":
    run_script_b()
