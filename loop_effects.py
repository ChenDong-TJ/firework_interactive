import json
import serial
import time
import os

def send_effect_to_arduino(effect):
    try:
        ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
        time.sleep(2)

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

def loop_effects(file_name="saved_variables.json"):
    if not os.path.exists(file_name):
        print("Error: No saved effects to loop through.")
        return

    with open(file_name, "r") as f:
        try:
            data = json.load(f)
            if not isinstance(data, list):
                raise ValueError("Saved data is not a list.")
        except (json.JSONDecodeError, ValueError):
            print("Error: Invalid saved data.")
            return

    print("Starting effect loop...")
    for effect in data:
        send_effect_to_arduino(effect)
        time.sleep(20)  # Delay between effects

if __name__ == "__main__":
    loop_effects()
