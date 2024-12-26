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

def load_function(requested_id):
    """
    Loads the variables with the given ID from the JSON file and sends them to Arduino.

    Args:
        requested_id (int): The ID of the variables to load.

    Returns:
        str: Success or error message.
    """
    file_name = "saved_variables.json"

    # Check if the file exists
    if not os.path.exists(file_name):
        return "Error: saved_variables.json does not exist."

    # Load existing data
    try:
        with open(file_name, "r") as f:
            data = json.load(f)
    except (json.JSONDecodeError, ValueError):
        return "Error: Failed to decode saved_variables.json."

    # Find the matching ID
    effect = next((item for item in data if item["id"] == requested_id), None)
    if not effect:
        return f"Error: No entry found with ID {requested_id}."

    # Send the effect to Arduino
    if send_effect_to_arduino(effect):
        return f"Effect with ID {requested_id} sent to Arduino successfully."
    else:
        return f"Effect with ID {requested_id} loaded, but failed to send to Arduino."

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Missing ID parameter.")
        sys.exit(1)

    try:
        requested_id = int(sys.argv[1])
        result = load_function(requested_id)
        print(result)
    except ValueError:
        print("Error: Invalid ID parameter.")
        sys.exit(1)
