import sys
import json

def preview_function(variables):
    # This is where you would implement your preview logic
    # For this example, we'll just return a string with some of the variables
    return f"Preview: Color1 Hue: {variables['color1']}, Slider1: {variables['slider1']}, Button1: {variables['button1']}"

if __name__ == "__main__":
    # Read the JSON string from command line argument
    variables_json = sys.argv[1]
    
    # Parse the JSON string
    variables = json.loads(variables_json)
    
    # Call the preview function
    result = preview_function(variables)
    
    # Print the result (this will be captured by the Node.js exec function)
    print(result)