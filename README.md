# Splitinam - Frontend
A React frontend for splitting shared expenses between groups - built with Vite and React.
> Create a session, share a direct link with your group, and everyone can open it and mark themselves as paid in real time. Connects to the [Splitinam API](https://github.com/dagnmt/splitinam-api).


## Features

- Create a shared expense session with a title, total amount, and participant list
- Automatic per-person cost preview before submitting
- Join any existing session via a shareable link (?id=XXXXXX)
- Name selection screen on first visit - no login required
- Live payment status updates via polling every 3 seconds
- Mark yourself as paid with one tap
- Copy shareable session link to clipboard
- URL state - session and name persist on page refresh

## Project Structure

```
src/
├── components/
│   ├── CreateView/          # Form to create a session
│   ├── NameSelectionView/   # Name picker on join
│   └── SessionView/         # Active session + live updates
├── utils/
│   └── AvatarColor.js       # Avatar color from name
├── App.jsx                  # Router + URL state
├── App.css                  # Global styles
└── main.jsx                 # Entry point
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Styling | Plain CSS |
| State | useState / useEffect (no external state library) |
| Build tool | Vite |
| API communication | Fetch API |

## Running Locally

### Prerequisites

- Node.js 18+
- [Splitinam API](https://github.com/dagnmt/splitinam-api) running on http://localhost:8080

### Setup
```
bashnpm install
npm run dev
```

Frontend will be available at http://localhost:5173

## Related

**Backend API**: [splitinam-api](https://github.com/dagnmt/splitinam-api) - Spring Boot, MySQL
