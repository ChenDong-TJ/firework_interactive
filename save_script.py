import sys
import json

def save_function(variables):
    # This is where you would implement your save logic
    # For this example, we'll just save the variables to a file
    with open('saved_variables.json', 'w') as f:
        json.dump(variables, f, indent=2)
    return "Variables saved successfully"

if __name__ == "__main__":
    # Read the JSON string from command line argument
    variables_json = sys.argv[1]
    
    # Parse the JSON string
    variables = json.loads(variables_json)
    
    # Call the save function
    result = save_function(variables)
    
    # Print the result (this will be captured by the Node.js exec function)
    print(result)