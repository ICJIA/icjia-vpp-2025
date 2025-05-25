---
title: "Syntax Highlighting Test"
description: "A comprehensive test page to verify that Shiki syntax highlighting is working correctly across multiple programming languages."
ogTitle: "Syntax Highlighting Test - Violence Prevention Plan for Illinois: 2025-2029"
ogDescription: "Testing Shiki syntax highlighting implementation with multiple programming languages and themes."
---

# Syntax Highlighting Test

This page demonstrates the Shiki syntax highlighting implementation across multiple programming languages and verifies that it works correctly in both light and dark themes.

## JavaScript

```javascript
// JavaScript example with various syntax elements
const apiUrl = 'https://api.example.com/data';

class DataProcessor {
  constructor(config) {
    this.config = config;
    this.cache = new Map();
  }

  async fetchData(endpoint) {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return null;
    }
  }

  processData(data) {
    return data
      .filter(item => item.active)
      .map(item => ({
        id: item.id,
        name: item.name.trim(),
        timestamp: new Date().toISOString()
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

// Usage example
const processor = new DataProcessor({ timeout: 5000 });
processor.fetchData('users').then(data => {
  if (data) {
    const processed = processor.processData(data);
    console.log('Processed data:', processed);
  }
});
```

## TypeScript

```typescript
// TypeScript example with interfaces and generics
interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Permission {
  resource: string;
  actions: string[];
}

class UserService<T extends User> {
  private users: T[] = [];

  constructor(private apiClient: ApiClient) {}

  async getUser(id: number): Promise<T | null> {
    try {
      const user = await this.apiClient.get<T>(`/users/${id}`);
      return user;
    } catch (error) {
      console.error(`Failed to get user ${id}:`, error);
      return null;
    }
  }

  hasPermission(user: T, resource: string, action: string): boolean {
    return user.roles.some(role =>
      role.permissions.some(permission =>
        permission.resource === resource &&
        permission.actions.includes(action)
      )
    );
  }
}
```

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Violence Prevention Plan</title>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  <header class="site-header" role="banner">
    <nav class="main-navigation" aria-label="Main navigation">
      <ul class="nav-list">
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main class="main-content" role="main">
    <section class="hero-section">
      <h1>Violence Prevention Plan for Illinois: 2025-2029</h1>
      <p>Building safer communities through evidence-based strategies.</p>
      <button type="button" class="cta-button">Learn More</button>
    </section>
  </main>

  <footer class="site-footer" role="contentinfo">
    <p>&copy; 2025 Illinois Criminal Justice Information Authority</p>
  </footer>

  <script src="/assets/js/main.js"></script>
</body>
</html>
```

## CSS

```css
/* CSS example with various selectors and properties */
:root {
  --primary-color: #1976d2;
  --secondary-color: #424242;
  --background-color: #ffffff;
  --text-color: #212121;
  --border-radius: 8px;
  --transition-duration: 0.3s;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
  padding: 2rem;
}

.hero-section h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.cta-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 1rem;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}
```

## Python

```python
# Python example with classes and async/await
import asyncio
import aiohttp
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ViolenceIncident:
    id: int
    location: str
    incident_type: str
    severity: int
    timestamp: datetime
    resolved: bool = False

class ViolencePreventionAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.incidents: List[ViolenceIncident] = []
    
    async def fetch_incidents(self, location: str) -> List[Dict]:
        """Fetch violence incidents from external API"""
        async with aiohttp.ClientSession() as session:
            headers = {'Authorization': f'Bearer {self.api_key}'}
            url = f'https://api.crimedata.gov/incidents?location={location}'
            
            try:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get('incidents', [])
                    else:
                        print(f"API error: {response.status}")
                        return []
            except Exception as e:
                print(f"Failed to fetch incidents: {e}")
                return []
    
    def analyze_trends(self) -> Dict[str, float]:
        """Analyze violence trends and return statistics"""
        if not self.incidents:
            return {}
        
        total_incidents = len(self.incidents)
        resolved_incidents = sum(1 for incident in self.incidents if incident.resolved)
        
        severity_avg = sum(incident.severity for incident in self.incidents) / total_incidents
        resolution_rate = (resolved_incidents / total_incidents) * 100
        
        return {
            'total_incidents': total_incidents,
            'resolution_rate': resolution_rate,
            'average_severity': severity_avg,
            'high_severity_count': sum(1 for i in self.incidents if i.severity >= 8)
        }

# Usage example
async def main():
    analyzer = ViolencePreventionAnalyzer('your-api-key-here')
    incidents_data = await analyzer.fetch_incidents('Chicago')
    
    for data in incidents_data:
        incident = ViolenceIncident(
            id=data['id'],
            location=data['location'],
            incident_type=data['type'],
            severity=data['severity'],
            timestamp=datetime.fromisoformat(data['timestamp'])
        )
        analyzer.incidents.append(incident)
    
    trends = analyzer.analyze_trends()
    print("Violence Prevention Analysis:", trends)

if __name__ == "__main__":
    asyncio.run(main())
```

## JSON

```json
{
  "violencePreventionPlan": {
    "title": "Violence Prevention Plan for Illinois: 2025-2029",
    "version": "1.0.0",
    "lastUpdated": "2025-05-25",
    "objectives": [
      {
        "id": 1,
        "title": "Reduce Youth Violence",
        "description": "Implement evidence-based programs to reduce youth involvement in violence",
        "targetReduction": 25,
        "timeline": "2025-2027",
        "strategies": [
          "Community mentorship programs",
          "After-school intervention programs",
          "Conflict resolution training"
        ]
      },
      {
        "id": 2,
        "title": "Strengthen Community Partnerships",
        "description": "Build collaborative relationships with community organizations",
        "targetReduction": 15,
        "timeline": "2025-2029",
        "strategies": [
          "Multi-agency task forces",
          "Community advisory boards",
          "Resource sharing agreements"
        ]
      }
    ],
    "metrics": {
      "baseline": {
        "violentCrimes": 12500,
        "youthInvolvement": 2800,
        "communityPrograms": 45
      },
      "targets": {
        "violentCrimes": 9375,
        "youthInvolvement": 2100,
        "communityPrograms": 75
      }
    },
    "funding": {
      "totalBudget": 15000000,
      "sources": [
        {
          "name": "Federal Grants",
          "amount": 8000000,
          "percentage": 53.3
        },
        {
          "name": "State Funding",
          "amount": 5000000,
          "percentage": 33.3
        },
        {
          "name": "Local Contributions",
          "amount": 2000000,
          "percentage": 13.3
        }
      ]
    }
  }
}
```

## Bash/Shell

```bash
#!/bin/bash

# Violence Prevention Data Processing Script
# Processes crime data and generates reports for the Illinois Violence Prevention Plan

set -euo pipefail

# Configuration
DATA_DIR="/var/data/violence-prevention"
OUTPUT_DIR="/var/reports"
LOG_FILE="/var/log/violence-prevention.log"
API_ENDPOINT="https://api.crimedata.illinois.gov"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    log "ERROR: $1"
    exit 1
}

# Success message
success() {
    echo -e "${GREEN}SUCCESS: $1${NC}"
    log "SUCCESS: $1"
}

# Warning message
warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
    log "WARNING: $1"
}

# Check dependencies
check_dependencies() {
    local deps=("curl" "jq" "python3" "sqlite3")
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            error_exit "Required dependency '$dep' is not installed"
        fi
    done
    
    success "All dependencies are available"
}

# Download crime data
download_data() {
    local year=$1
    local output_file="$DATA_DIR/crime_data_${year}.json"
    
    log "Downloading crime data for year $year"
    
    if curl -s -f "$API_ENDPOINT/data?year=$year" -o "$output_file"; then
        success "Downloaded crime data for $year"
    else
        error_exit "Failed to download crime data for $year"
    fi
}

# Process data with Python
process_data() {
    local input_file=$1
    local output_file=$2
    
    log "Processing data: $input_file -> $output_file"
    
    python3 << EOF
import json
import sys
from datetime import datetime

try:
    with open('$input_file', 'r') as f:
        data = json.load(f)
    
    # Process the data
    processed = {
        'processed_at': datetime.now().isoformat(),
        'total_incidents': len(data.get('incidents', [])),
        'summary': {
            'violent_crimes': sum(1 for i in data.get('incidents', []) if i.get('type') == 'violent'),
            'property_crimes': sum(1 for i in data.get('incidents', []) if i.get('type') == 'property'),
            'other_crimes': sum(1 for i in data.get('incidents', []) if i.get('type') == 'other')
        }
    }
    
    with open('$output_file', 'w') as f:
        json.dump(processed, f, indent=2)
    
    print("Data processing completed successfully")
    
except Exception as e:
    print(f"Error processing data: {e}", file=sys.stderr)
    sys.exit(1)
EOF
    
    if [ $? -eq 0 ]; then
        success "Data processing completed"
    else
        error_exit "Data processing failed"
    fi
}

# Generate report
generate_report() {
    local data_file=$1
    local report_file="$OUTPUT_DIR/violence_prevention_report_$(date +%Y%m%d).html"
    
    log "Generating HTML report: $report_file"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Violence Prevention Report - $(date +%Y-%m-%d)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #1976d2; color: white; padding: 20px; }
        .content { padding: 20px; }
        .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Violence Prevention Report</h1>
        <p>Generated on $(date)</p>
    </div>
    <div class="content">
        <h2>Summary</h2>
        <div class="metric">
            <h3>Data processed from: $data_file</h3>
        </div>
    </div>
</body>
</html>
EOF
    
    success "Report generated: $report_file"
}

# Main execution
main() {
    log "Starting violence prevention data processing"
    
    # Create directories if they don't exist
    mkdir -p "$DATA_DIR" "$OUTPUT_DIR"
    
    # Check dependencies
    check_dependencies
    
    # Process data for current year
    local current_year=$(date +%Y)
    download_data "$current_year"
    
    local input_file="$DATA_DIR/crime_data_${current_year}.json"
    local processed_file="$DATA_DIR/processed_${current_year}.json"
    
    process_data "$input_file" "$processed_file"
    generate_report "$processed_file"
    
    success "Violence prevention data processing completed"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

---

## Testing Results

If you can see this page with properly highlighted code blocks showing:
- **Keywords** in different colors (like `const`, `class`, `async`, `def`, etc.)
- **Strings** in distinct colors
- **Comments** in muted colors
- **Numbers** and **operators** properly styled
- **Different themes** for light and dark modes

Then the Shiki syntax highlighting implementation is working correctly! 🎉

*This test page was created on May 25, 2025 to verify Shiki syntax highlighting functionality.*
