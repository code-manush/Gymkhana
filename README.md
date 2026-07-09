
# Gymkhana — IIIT Vadodara Student Portal
A web portal built for the Gymkhana (student activity body) of IIIT Vadodara. It handles event listings, club information, and student engagement — basically a one-stop place for campus life stuff.
Built this as part of a college initiative to digitize the student council's presence.
## Tech Stack
- React.js (frontend)
- Node.js + Express (backend)
- MongoDB (database)
- Tailwind CSS (styling)
## Setup
```bash
git clone https://github.com/hck-anmol/Gymkhana.git
cd Gymkhana
Frontend:

bash


cd client
npm install
npm run dev
Backend:

bash


cd server
npm install
npm start
Create a .env file in the server directory:



MONGO_URI=your_mongodb_connection_string
PORT=5000
App runs at http://localhost:5173 (frontend) and http://localhost:5000 (backend).