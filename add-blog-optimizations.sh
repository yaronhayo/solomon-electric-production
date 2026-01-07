#!/bin/bash
cd /Users/yaronhayo/Desktop/solomon-electric/src/content/blog

echo "Phase 3: Adding image alt text to all blog posts..."

# Function to add alt text after image line
add_alt() {
  local file=$1
  local alt=$2
  # Check if imageAlt already exists
  if ! grep -q "imageAlt:" "$file"; then
    # Find the line with image: and add imageAlt after it
    sed -i '' "/^image:/a\\
imageAlt: '$alt'
" "$file"
    echo "✓ Added alt text to $file"
  else
    echo "- Alt text already exists in $file"
  fi
}

# Add alt text to all posts
add_alt "electrical-panel-modernization-upgrades.mdx" "Licensed electrician installing modern 200-amp electrical panel in Miami home"
add_alt "comprehensive-electrical-safety-inspections.mdx" "Professional electrician performing comprehensive electrical safety inspection with thermal imaging camera"
add_alt "tesla-universal-ev-charging-station-installation.mdx" "Tesla Wall Connector and Level 2 EV charger installation in Miami garage"
add_alt "electrical-panel-repair.mdx" "Electrician diagnosing and repairing circuit breaker panel issues"
add_alt "lighting-fixture-installation.mdx" "Professional installation of modern recessed lighting and pendant fixtures"
add_alt "outlet-switch-modernization-services.mdx" "Modern GFCI outlet and smart switch installation in Miami home"
add_alt "premium-ceiling-fan-installation-balancing.mdx" "Professional ceiling fan installation and balancing service"
add_alt "kitchen-appliance-specialty-equipment-wiring.mdx" "240V electrical wiring installation for kitchen appliances and electric range"
add_alt "architectural-lighting-chandelier-installation.mdx" "Luxury chandelier installation in high-ceiling Miami home foyer"
add_alt "intelligent-sensor-security-lighting-systems.mdx" "Motion sensor security lighting and smart outdoor lighting system"
add_alt "life-safety-detection-system-installation.mdx" "Hardwired interconnected smoke detector and carbon monoxide alarm installation"
add_alt "comprehensive-electrical-installation-services.mdx" "Complete electrical system installation for new construction home"
add_alt "expert-electrical-diagnostics-repair.mdx" "Professional electrician using diagnostic equipment to troubleshoot electrical problems"
add_alt "pull-wires-underground.mdx" "Underground electrical conduit and wiring installation for pool and landscape lighting"
add_alt "preventive-maintenance-electrical-system-optimization.mdx" "Electrical panel maintenance and system optimization service with thermal imaging"

echo ""
echo "✅ Image alt text optimization complete!"
