TaskGlitch - Task Management Web App
A comprehensive task management application designed for sales teams to track, manage, and prioritize tasks based on ROI (Return on Investment). This project demonstrates real-world bug fixing and performance optimization in a React TypeScript application.

🚀 Features
Task Management- Add, edit, delete, and view tasks with detailed information

ROI-Based Prioritization- Automatically calculate and sort tasks by Return on Investment

Advanced Analytics- Comprehensive dashboards with charts and performance metrics

CSV Import/Export- Bulk operations via CSV files

Undo Functionality- Recover accidentally deleted tasks with snackbar notifications

Local Storage- Data persistence without backend requirements

Responsive Design- Works seamlessly across all devices

🎯 Task Fields
Each task includes-

Title- Task name/description

Revenue- Expected revenue (numeric)

Time Taken- Hours required to complete

ROI- Automatically calculated as Revenue ÷ Time Taken

Priority- High, Medium, or Low

Status- Todo, In Progress, or Done

Notes- Additional information

Timestamps- Creation and completion dates



🛠️ Tech Stack
Frontend- React 18 + TypeScript

UI Framework- Material-UI (MUI)

Charts- MUI X Charts

State Management- React Context + Hooks

Build Tool- Vite

Deployment- Vercel


🐛 Bugs Fixed
This project specifically addresses 5 critical bugs-

1. Double Fetch Issue
Problem- API/data fetch running twice on page load

Solution- Removed duplicate useEffect and added proper cleanup

2. Undo Snackbar Bug
Problem- Deleted tasks not cleared correctly after snackbar closes

Solution- Implemented proper state cleanup on snackbar exit

3. Unstable Sorting
Problem- Tasks with same ROI flickered and reordered randomly

Solution- Added deterministic title-based tie-breaker

4. Double Dialog Opening
Problem- Clicking edit/delete opened both action and view dialogs

Solution- Prevented event bubbling with stopPropagation()

5. ROI Calculation Errors
Problem- Division by zero and invalid inputs causing Infinity/NaN

Solution: Added comprehensive validation and error handling


# Clone the repository
git clone https://github.com/sanjeev-cmyk/task-glitch.git

# Navigate to project directory
cd task-glitch

# Install dependencies
npm install

# Start development server
npm run dev










