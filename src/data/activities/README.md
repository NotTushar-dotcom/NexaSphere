# ⭐ src/data/activities/

One file per activity type. To update any activity's events, **edit only that activity's file**.

---

## File Map

| File | Activity | Page Color |
|---|---|---|
| `hackathon.js` | Hackathon | `#00d4ff` cyan |
| `codathon.js` | Codathon | `#6366f1` indigo |
| `ideathon.js` | Ideathon | `#f59e0b` amber |
| `workshop.js` | Workshop | `#10b981` green |
| `insightSession.js` | Insight Session / KSS | `#a855f7` purple |
| `openSourceDay.js` | Open Source Day | `#06b6d4` sky |
| `techDebate.js` | Tech Debate | `#ef4444` red |
| `index.js` | Master export — **do not edit** | — |

---

## How to Add a New Conducted Event

**Example: adding KSS #154**

1. Open `insightSession.js`
2. Find the `conductedEvents: [` array
3. Copy the KSS #153 block and paste it above (or below)
4. Update these fields:

```js
{
  id: 'kss-154',                          // ← unique, change this
  name: 'KSS #154 — Your Topic Here',    // ← change
  shortName: 'KSS #154',                 // ← change
  date: 'Month Year',                    // ← change
  status: 'completed',
  tagline: 'One-line teaser...',         // ← change
  stats: [
    { label: 'Presenters', value: '3' },
    { label: 'Attendees', value: '50+' },
    { label: 'Duration', value: '1 hr' },
    { label: 'Session', value: '#154' },
  ],
  overview: `Full description of the session...`,
  topics: [
    {
      title: 'Topic Title',
      speaker: 'Speaker Name',
      role: 'Presenter',
      duration: '—',
      summary: 'Summary of what was covered...',
    },
  ],
  videoPresenter: [{ name: 'Name', role: 'Video Presentor' }],
  anchor: { name: 'Name', role: 'Anchor' },
  volunteers: [{ name: 'Volunteer Name' }],
  acknowledgements: [
    { name: 'Prof. Name', title: 'Title', note: 'Thank you note...' },
  ],
  closingNote: 'Closing message...',
  photoLink: null,    // ← Add Google Drive link when ready
  videoLink: null,    // ← Add YouTube link when ready
  hashtags: ['#KSS154', '#NexaSphere', '#GLBajaj'],
},
```

5. Commit to GitHub — page updates automatically in ~2 minutes

---

## How to Add Photo / Video Links

Open the activity file and set the `photoLink` / `videoLink` for the event:

```js
photoLink: 'https://drive.google.com/drive/folders/your-folder-id',
videoLink: 'https://youtube.com/watch?v=your-video-id',
```

Buttons appear automatically on the event detail page. Leave as `null` to show "Coming soon".

---

## How to Add an Upcoming Event

Add to the `upcomingEvents: [` array:

```js
{
  name: 'Hackathon 1.0',
  date: 'April 2025',
  description: 'Brief description of what to expect...',
},
```

---

## index.js — Do Not Edit

This file simply imports all activity files and exports them as one object. The keys **must exactly match** the `title` fields in `src/data/activitiesData.js`.

```js
export const activityPages = {
  'Hackathon':       hackathon,
  'Codathon':        codathon,
  'Ideathon':        ideathon,
  'Workshop':        workshop,
  'Insight Session': insightSession,
  'Open Source Day': openSourceDay,
  'Tech Debate':     techDebate,
};
```
