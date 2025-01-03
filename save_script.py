import sys
import json
import os
import serial
import time

# Helper to send effect to Arduino
def send_effect_to_arduino(effect):
    try:
        ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
        time.sleep(2)  # Wait for the connection to stabilize

        command = f"P,{effect['color1'][0]},{effect['color1'][1]},{effect['color1'][2]}," + \
                  f"{effect['color2'][0]},{effect['color2'][1]},{effect['color2'][2]}," + \
                  f"{effect['maxBrightness']},{effect['launchMode']},{effect['gradientMode']}," + \
                  f"{effect['explodeMode']},{effect['laserColor']},{effect['mirrorAngle']}," + \
                  f"{effect['explosionLEDCount']},{effect['speedDelay']}\n"
        ser.write(command.encode())
        print(f"Command sent to Arduino: {command.strip()}")
        ser.close()
        return True
    except Exception as e:
        print(f"Error communicating with Arduino: {e}")
        return False

def save_function(variables):
    """
    Appends the given variables to a JSON file with a unique ID and sends the effect to Arduino.

    Args:
        variables (dict): The input variables to save.

    Returns:
        str: Success message with the assigned ID.
    """
    file_name = "saved_variables.json"
    data = []

    # Load existing data
    if os.path.exists(file_name):
        with open(file_name, "r") as f:
            try:
                data = json.load(f)
                if not isinstance(data, list):
                    raise ValueError("Existing data is not a list")
            except (json.JSONDecodeError, ValueError):
                data = []

    # Assign a unique ID
    new_id = len(data) + 1
    variables["id"] = new_id

    # Append the new variables
    data.append(variables)

    # Save the updated data
    with open(file_name, "w") as f:
        json.dump(data, f, indent=2)

    # Send the effect to Arduino
    if send_effect_to_arduino(variables):
        return f"您的专属烟花ID: {new_id}"
    else:
        return f"Variables saved successfully with ID: {new_id}, but failed to communicate with Arduino."

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Missing input JSON.")
        sys.exit(1)

    variables_json = sys.argv[1]
    try:
        variables = json.loads(variables_json)
        result = save_function(variables)
        print(result)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input - {e}")
        sys.exit(1)
