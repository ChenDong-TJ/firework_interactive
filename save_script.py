import sys
import json
import os

def save_function(variables):
    """
    Appends the given variables to a JSON file with a unique ID.

    Args:
        variables (dict): The input variables to save.

    Returns:
        str: Success message with the assigned ID.
    """
    # File to save the variables
    file_name = "saved_variables.json"
    data = []

    # Load existing data if the file exists
    if os.path.exists(file_name):
        with open(file_name, "r") as f:
            try:
                data = json.load(f)
                if not isinstance(data, list):  # Ensure `data` is a list
                    raise ValueError("Existing data is not a list")
            except (json.JSONDecodeError, ValueError):
                data = []  # Reset to an empty list if corrupted or invalid

    # Assign a unique ID
    new_id = len(data) + 1
    variables["id"] = new_id

    # Append the new variables
    data.append(variables)

    # Save the updated data back to the file in the required format
    with open(file_name, "w") as f:
        json.dump(data, f, indent=2)

    return f"Variables saved successfully with ID: {new_id}"

if __name__ == "__main__":
    # Read the JSON string from the command line argument
    if len(sys.argv) < 2:
        print("Error: Missing input JSON.")
        sys.exit(1)

    variables_json = sys.argv[1]
    
    try:
        # Parse the JSON string
        variables = json.loads(variables_json)
        
        # Call the save function
        result = save_function(variables)
        
        # Print the result (this will be captured by the Node.js exec function)
        print(result)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input - {e}")
        sys.exit(1)
