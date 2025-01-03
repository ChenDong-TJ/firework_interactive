import sys
import json
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

def preview_function(variables):
    """
    Sends the effect to Arduino for preview.

    Args:
        variables (dict): The input variables for preview.

    Returns:
        str: Preview result.
    """
    if send_effect_to_arduino(variables):
        return f"Preview successful: {variables}"
    else:
        return f"Preview failed to communicate with Arduino."

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Missing input JSON.")
        sys.exit(1)

    variables_json = sys.argv[1]
    try:
        variables = json.loads(variables_json)
        result = preview_function(variables)
        print(result)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input - {e}")
        sys.exit(1)
