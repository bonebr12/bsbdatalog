# **App Name**: Drone Flight Insights

## Core Features:

- User Authentication: Secure user accounts with email/password and optional OAuth (Google, etc.) login. Supports 'pilot' and 'admin' roles.
- Flight Log Upload: Upload DJI .txt or equivalent flight log files.
- Log Processing: Parse uploaded logs using a Cloud Function and the dji-log-parser library to extract normalized data. Processes logs including encrypted versions (>= v13) that require an API key.
- Flight Visualization: Display flight paths on a map and generate altitude, speed and temperature charts.
- Pilot Dashboard: Individual dashboard for pilots with a list of flights and aggregated statistics.
- Customizable Alert System: Define custom alert thresholds (e.g., battery < 20%) and receive push/email notifications when exceeded. Use the LLM to determine whether thresholds should change due to the drone's environment.
- Admin Panel: Administrative panel for monitoring usage, users, uploads, etc.

## Style Guidelines:

- Primary color: Sky Blue (#87CEEB), representing the sky and flight. Its slightly desaturated to be used for UIs.
- Background color: Light gray (#F5F5F5) for a clean and modern look. 20% desaturation is a starting point, adjust until the aesthetic looks machine-perfect.
- Accent color: Teal (#008080) for interactive elements and important notifications. With respect to Sky Blue, is 30 degrees to the left on the color wheel. A lower brightness distinguishes it further from Sky Blue.
- Body font: 'PT Sans', sans-serif. The modern style of 'PT Sans' combined with some warmth is suited to the relatively large blocks of text likely to appear in the UI.
- Headline font: 'Playfair', serif. The high-contrast thin-thick lines of 'Playfair' gives the headings an elegant, fashionable, high-end feel.
- Use modern, minimalist icons representing flight metrics, alerts, and drone components.
- Responsive design for web and mobile with a clean and intuitive interface.