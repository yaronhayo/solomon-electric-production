import re

# Read the file
with open('src/data/services.ts', 'r') as f:
    content = f.read()

# Image mapping based on service name keywords
image_map = {
    # Panel services
    'panel upgrade': 'panelUpgrade200aImg',
    'panel replacement': 'panelUpgrade200aImg',
    'panel repair': 'panelUpgrade200aImg',
    'surge protection': 'panelUpgrade200aImg',
    
    # Emergency services
    'emergency': 'emergencyServiceImg',
    'outage': 'emergencyServiceImg',
    'fire hazard': 'emergencyServiceImg',
    'burning smell': 'emergencyServiceImg',
    'storm damage': 'emergencyServiceImg',
    'sparking': 'panelUpgrade200aImg',
    
    # Outlets & Wiring
    'outlet installation': 'outletInstallImg',
    '240v outlet': 'outletInstallImg',
    'gfci outlet': 'gfciOutletImg',
    'switch installation': 'outletInstallImg',
    'rewiring': 'rewiringWorkImg',
    'wiring updates': 'rewiringWorkImg',
    'system upgrade': 'rewiringWorkImg',
    'code compliance': 'rewiringWorkImg',
    
    # Lighting
    'recessed lighting': 'recessedLightingImg',
    'led lighting': 'recessedLightingImg',
    'led retrofit': 'ledRetrofitImg',
    'ceiling fan': 'ceilingFanImg',
    'landscape': 'landscapeLightingImg',
    'outdoor lighting': 'landscapeLightingImg',
    'indoor & outdoor lighting': 'landscapeLightingImg',
    'motion-sensor': 'recessedLightingImg',
    
    # Smart Home
    'smart thermostat': 'smartHomeImg2',
    'smart lighting': 'smartHomeImg2',
    'smart switch': 'smartHomeImg2',
    'ring doorbell': 'securityCameraImg',
    'security camera': 'securityCameraImg',
    'home theater': 'securityCameraImg',
    'network outlet': 'outletInstallImg',
    
    # EV Charging
    'ev charger': 'evChargerInstallImg',
    'electric vehicle': 'evChargerInstallImg',
    'solar panel': 'evChargerInstallImg',
    
    # Generators
    'generator': 'generatorInstallImg',
    'transfer switch': 'generatorInstallImg',
    'backup power': 'generatorInstallImg',
    'emergency power': 'generatorInstallImg',
    
    # Specialty
    'hot tub': 'hotTubWiringImg',
    'pool': 'hotTubWiringImg',
    'spa': 'hotTubWiringImg',
    'sauna': 'hotTubWiringImg',
    'holiday lighting': 'landscapeLightingImg',
    'waterproof outlet': 'gfciOutletImg',
    'dock': 'hotTubWiringImg',
    'marina': 'hotTubWiringImg',
    
    # Commercial
    'commercial panel': 'commercialPanelImg',
    'tenant build': 'commercialPanelImg',
    'commercial led': 'ledRetrofitImg',
    'high-voltage': 'commercialPanelImg',
    'three-phase': 'commercialPanelImg',
    'commercial gfci': 'gfciOutletImg',
    'parking lot': 'landscapeLightingImg',
    'exit & emergency': 'recessedLightingImg',
    
    # Inspection
    'inspection': 'inspectionWorkImg',
    'certification': 'inspectionWorkImg',
    'audit': 'inspectionWorkImg',
    'permit': 'inspectionWorkImg',
}

# Function to find the image for a service name
def get_image_for_service(service_name):
    name_lower = service_name.lower()
    for keyword, image in image_map.items():
        if keyword in name_lower:
            return image
    # Default fallback
    return 'panelUpgrade200aImg'

# Find all service entries and add images
pattern = r"(\{[^}]*name:\s*'([^']*)'[^}]*icon:\s*\w+,)(\s*category:)"

def replacement(match):
    full_match = match.group(1)
    service_name = match.group(2)
    category = match.group(3)
    
    # Check if image already exists
    if 'image:' in full_match:
        return match.group(0)
    
    image_name = get_image_for_service(service_name)
    return f"{full_match}\n        image: {image_name},{category}"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open('src/data/services.ts', 'w') as f:
    f.write(content)

print("Images added to all services!")
