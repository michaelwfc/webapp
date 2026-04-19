# State Management
*CS142 Lecture Notes — Mendel Rosenblum*

A simple, read-only app is easy to reason about. But the moment users can log in, create content, and change data, you face a hard question: when something changes in one part of your app, how does every other part find out? This tutorial takes you from the chaos of ad-hoc callbacks to the clarity of centralized state management — explaining not just what each pattern is, but why it exists and when you need it.

---

## Why Simple Apps Are Deceptively Easy

Imagine you're building a photo-sharing app in React. In the early stages, it's read-only: users can browse photos and view profiles, but nothing changes. Each component — TopBar, UserList, UserDetail, UserPhotos — fetches its own data when it mounts, renders it, and that's that. Life is good.

This arrangement follows the classic **Model-View-Controller (MVC)** pattern — the model is your data, the view is what the user sees, and the controller is the logic that connects them. When everything is static, this works beautifully. Components are modular and independent. Each one knows exactly what data it needs and goes to get it.

But the moment users can actually do things — log in, add a photo, post a comment — the picture changes dramatically. Consider two scenarios that break the simple model immediately.

First: a user posts a new comment on a photo. The UserPhotos component is currently displaying that photo, but it fetched its data when it first loaded. The new comment exists on the server, but the component has no idea. Its model data is now stale — and it will stay stale until something forces a refresh.

Second: a user logs out and logs back in as a different account. Suddenly, everything your components fetched and cached is wrong. The sidebar user list, the profile details, the photos — all of it belongs to the old session. Your entire app is looking at data for the wrong person.

These aren't edge cases. They're the normal reality of any interactive web application. And they reveal a fundamental truth: state management is the hard problem at the center of frontend development.

Key Takeaway
Read-only apps with static data are straightforward to build — components can fetch their own data at startup and be done with it. But as soon as users can create, update, or delete data, or change session state, components need a way to stay in sync with a world that keeps changing around them.


### The Complexity of Real Web Apps

A small, read-only photo app may seem simple:

- **Model, View, Controller** — all set up on startup and static
- Components independently fetch their own model data
- Some duplicate model fetches (e.g. `UserDetail` and `UserList` both fetch user data)

However, once you **add session state and object creation/updating**, things become significantly more complex for a single-page app:

- A user adding new comments or photos means **model data of one view is changed by another view**
- A user logging out and back in with a different account means **a major change across all model data**

---


## Session State: Keeping the Browser and Server in Sync


**Keeping/Shared the Browser(Frontend) and Server(Backend) in Sync**
Session state — who is currently logged in, and what they're allowed to do — is a special kind of data that has to exist in two places at once: in the browser (so the UI knows what to show) and on the server (so it can authorize requests). Keeping these two copies in sync is one of the trickiest parts of building a web application.

Here's the core tension: the server enforces authentication on every single request. If a user isn't logged in, the server won't return their data — it will respond with an error, typically a 401 (Unauthorized). This means that if your React components try to fetch their models when they first mount, and the user isn't logged in yet, those fetches will all fail silently or throw errors.


Session state must be **kept in sync** between the browser application and the server. The server needs to know who (if anyone) is logged in.

The server will **reject any requests from unauthenticated users**, which means model fetching done only at component startup may no longer work.

Consider the key transitions in a photo app:

### The login transition

**Login** (not logged in → logged in)
- At app startup, most models are unavailable (e.g. the sidebar user list)
- They become available only after login completes

Think about what happens when a user first opens your app before signing in. The sidebar that shows a list of all users? That requires an authenticated request — the server won't serve it to an anonymous visitor. The photo feed? Same story. At startup, most of the app's data is unavailable — it's locked behind the login wall.

Once the user successfully logs in, the floodgates open. The session is established, and suddenly all those models that were previously off-limits can be fetched. But the components that wanted to fetch them at startup have already given up. Something needs to tell them: "now's your chance — go get the data."


### The logout transition
**Logout** (logged in → not logged in)
- Requests to the web server that worked before will now fail

Logout is the mirror image, and arguably harder to handle correctly. Everything was working fine — components had their data, the user was browsing happily — and then they click "Sign Out." From this moment, every HTTP request your app makes will fail. The session cookie is gone. The server will reject all of them with a 401 error.

If your app doesn't handle this gracefully, the user gets a broken experience: stale data on screen, failed background requests, and confusing error states. The app needs to know about the logout event and react to it — clearing cached data, redirecting to the login page, and resetting itself to an unauthenticated state.


Key Takeaway
Login and logout are major state transitions that affect every component in your app. Login unlocks data that was previously unavailable; logout invalidates data that was previously valid. Components that fetch data only at startup will be caught off-guard by both transitions — your state management strategy needs to account for them explicitly.

---

## Model Updates

### When Data Changes After the Page Loads
When new objects — users, photos, or comments — are added:

- Models **change**
- Controllers fetching models only at startup may miss these changes
- In the photo app, adding a photo or comment requires a **model refresh**

This creates a challenge: how do you keep components in sync with a changing data model?

The solution — whatever form it takes — has to answer a specific question: when something changes somewhere, how do the components that care about it find out? This is the central design question of state management.

Key Takeaway
Data changes after the page loads. A component that fetched its data at startup is showing a frozen snapshot of the world — not the live reality. State management exists to solve this: ensuring that when data changes, the components displaying that data are notified and can re-render with fresh information.


---
## Communication Between Components

### How Components Talk to Each Other
So how does a component find out that something outside of it has changed? React gives you the building blocks, but not the answer. There are two main approaches, and understanding both will help you see why the second one exists.

Components Interested in Outside Events
The core problem: how do you keep a modular design but allow controllers to be **notified of things happening outside of them**?

Example: a photo view component and a photo add component — the view needs to know when the add component creates new data.

#### Option 1: Passing callbacks- the simple approach

Explicit communication interfaces

Pass callback functions directly to components:

```jsx
<Component commInfo={this.callMeWithInfo.bind(this)} />
```

The most direct approach is to pass a function from a parent component down to a child as a prop. When the child does something interesting — adds a photo, posts a comment — it calls that function, and the parent reacts. This is the communication approach you learn first in React, and it works well for simple parent-child relationships.


The child component receives **commInfo** as a prop and calls it when it has information to report. The parent's method **callMeWithInfo** runs in response, potentially updating state and triggering a re-render.

The problem with callbacks is that they don't scale. Imagine you have a photo add component that's nested several levels deep in the component tree, and three different components at different levels all want to know when a new photo is added. You'd have to thread that callback all the way down through every intermediate component — even the ones that don't care about it at all. This phenomenon has an unglamorous name in the React world: **prop drilling**.



#### Option 2: Listener/Emitter pattern:  — the scalable/better approach

- A component registers interest by **listening**
- The component that detects a change **emits** a signal
- Decouples the producer of the change from all the consumers

The listener/emitter pattern (also called publish/subscribe) solves this elegantly. Instead of components directly calling each other's functions, there's an intermediary: an event system. A component that cares about an event listens for it by registering a handler. A component that produces an event emits it when something happens. The two components don't need to know anything about each other — they only need to know about the shared event system.


Key Takeaway
Callbacks work for simple parent-child communication, but break down as your component tree grows. The listener/emitter pattern decouples producers from consumers — components broadcast events without knowing who's listening, and interested components subscribe without knowing who's broadcasting. This is the conceptual foundation of every major state management library.


---

## React State Management Libraries

React itself is deliberately silent on the question of state management. The core library gives you local component state (**this.state** and **setState**) and a way to pass data down the tree via props — but it offers nothing for sharing state across distant components or coordinating data fetching globally. This was an intentional design choice: React wanted to be a view library, not an entire framework.

The result is a rich ecosystem of third-party libraries that fill this gap, each with a distinct philosophy about how state should flow through an application.

React itself has **no opinion** on how to manage global state. The ecosystem offers several popular solutions:

- **[FLUX](https://facebook.github.io/flux/)** — Facebook's application architecture for building user interfaces. State is stored in a "Store", changed via "actions", and view listeners are notified.

Facebook's original architecture for building user interfaces with React. Introduced the concept of a **unidirectional data flow**: user actions trigger dispatched events, a Store updates its state in response, and views re-render from the Store. FLUX is more of a pattern than a library — it defines how data should flow, and you implement the pieces.


- **[Redux](https://redux.js.org/)** — A predictable state container for JavaScript apps.
The most widely adopted state management library in the React ecosystem. Redux formalizes the FLUX pattern with a single global Store, pure functions called reducers that specify how state changes in response to actions, and a strict one-way data flow. Its predictability makes debugging significantly easier — you can replay actions to reproduce any state.


- **[Relay](https://relay.dev/)** — The production-ready GraphQL client for React.

Facebook's production GraphQL client for React. Rather than managing state globally, Relay co-locates data requirements with the components that need them — each component declares what data it needs using GraphQL fragments, and Relay handles fetching, caching, and updating. Best suited for apps with a GraphQL backend.


All three share the same underlying insight: components shouldn't be responsible for fetching and managing their own data in isolation. There should be a single source of truth — a central place where state lives — and components should derive their view from that source rather than maintaining their own private copies.


Key Takeaway
React leaves global state management to the ecosystem. FLUX, Redux, and Relay all share the same core idea: state should have a single source of truth, changes should flow through a predictable path, and components should react to state changes rather than managing their own data in isolation. Choose the one that matches your app's complexity and backend.

---
## Before and After: The Photo App Architecture

The difference between an app without state management and one with it is best understood by seeing both architectures side by side. Let's use the photo app as a concrete example.

### Photo App: Current Model Data Handling Without a state manager

Without a state manager, each component fetches its own data independently. Coordination between components happens only through callbacks:

In the current photo app, every component is an island. When TopBar needs data, it fetches it. When UserList needs data, it fetches it — even if TopBar already fetched the same user list moments ago. Coordination between components happens only when someone explicitly passes a callback, and that callback has to travel all the way through the component tree to get where it's needed.

```
TopBar      → Model Data (own fetch)
UserDetail  → Model Data (own fetch)
UserPhotos  → Model Data (own fetch)
UserList    → Model Data (own fetch)
                ↕ callback (ad hoc coordination)
```

This works for simple read-only apps but breaks down when data changes.

Each component fetches data independently at startup. If the same user data is needed by three components, it gets fetched three times. When data changes, there's no systematic way to notify everyone — only the components that received a callback will know.

---

### Photo App: With State Management

With a central state manager, the architecture flips. Components no longer go out to fetch data themselves — instead, they subscribe to the specific slices of state they care about. The state manager is responsible for fetching data from the server, caching it, and pushing updates to every subscribed component whenever something changes.

With a central state manager, components **subscribe** to the pieces of state they care about:

```
TopBar      ← Subscribe: Context (current user, page title)
UserDetail  ← Subscribe: Current User Detail
UserPhotos  ← Subscribe: Current Photos
UserList    ← Subscribe: UserList

User Actions → State Manager → Web Server
             ← Model Updates ←
```

Benefits:
- Centralized data fetching — no duplicate requests
- Components automatically re-render when subscribed state changes
- User actions flow predictably through a single path


Data flows in one direction: from the server to the state manager to subscribed components. When the server's data changes, the state manager updates, and every component subscribed to that slice of state automatically re-renders with fresh data.

Key Takeaway
Without a state manager, components are islands that fetch data independently and communicate through ad-hoc callbacks. With one, there's a single source of truth: components subscribe to what they need, user actions flow through a predictable path, and updates propagate automatically to every component that cares.

---

### Photo App: With Offline Support

One of the less obvious benefits of centralizing state management is how naturally it enables offline support — the ability for your app to keep working when the user has no internet connection.

When every component fetches its own data directly from the server, offline support is nearly impossible to retrofit. Each component would need its own caching logic, its own fallback behavior, its own way of queuing requests for when connectivity returns. The surface area is enormous.

With a state manager sitting between components and the server, the picture is completely different. The state manager becomes the single point of contact with the network. Components don't know — or care — whether their data came from a live server request or a local cache. They just subscribe and render whatever the state manager gives them.


A state manager also makes it straightforward to add **offline support**:

- The state manager can cache data locally when the network is unavailable
- When connectivity is restored, it syncs with the server
- Components don't need to know whether data came from the network or cache

```
State Manager ↔ Web Server (when online)
State Manager ↔ Local Cache (when offline)
Components ← Always get data from State Manager — no network knowledge needed
```

The state manager handles the difference between online and offline transparently. When offline, it serves cached data to components. When connectivity restores, it syncs changes with the server and updates the cache. Components never need to handle either scenario themselves.

---

### When Other Users Change the Data: Three Strategies

There's one more dimension of the state problem that's easy to overlook: what happens when it's not your user making changes, but someone else entirely? In a multi-user app like a photo-sharing platform, data is changing all the time — other users are uploading photos, posting comments, and updating their profiles — and your app needs a strategy for handling those changes.

There are three fundamentally different approaches, each with a distinct set of tradeoffs:


Dealing with Other Model Changes

What happens if **another user** adds a photo or comment? You have three options:

| Strategy | How it works | Tradeoff |
|---|---|---|
| **Do nothing** | Fetch data once at startup. Never refresh unless the user triggers it manually.  | Users won't see new content until they trigger a refresh — very disconcerting for their own changes |
| **Poll** | Periodically re-fetch the model, or provide a UI refresh button | A good practical balance. Stale data for at most one polling interval. A manual refresh button gives users control and sets clear expectations. |
| **Server push** | The server pushes changes to the browser the instant they happen, using WebSockets or Server-Sent Events. | Users see updates in real time. But implementation is complex, and incoming changes can conflict with edits the user is currently making — requiring careful conflict resolution. |


For most applications at an early stage, polling is the sweet spot. It's simple to implement, easy to reason about, and gives users a reasonable experience. Server push is worth the investment only when real-time updates are a core part of the product — think collaborative editing tools or live chat.


---

## ReactJS: Photo App with Sessions and Input

Now that we've covered the theory, let's look at how these concepts come together in a concrete React application — specifically, how you track who is logged in and how you protect routes from unauthenticated access.

### Tracking login state

The app needs to **track who is logged in**:

- Ideally held in a state store
- Can be kept in the top-level `PhotoShare` component state (see React Context mechanism)

The app needs to know, at all times, whether a user is logged in. The cleanest way to manage this is in a state store — the same Redux or FLUX store that manages the rest of your app's state. If you don't have a full state management library yet, keeping it in the top-level component's state (and distributing it via React Context) is a perfectly valid starting point.

The key is that this userIsLoggedIn flag (or the logged-in user object itself) is accessible everywhere in the component tree. When login succeeds, you set it. When logout happens, you clear it. Every component that depends on authentication status subscribes to it and responds appropriately.

### Guarding routes with React Router

React Router lets you conditionally render different components for the same URL path. This is how you protect routes: if the user is logged in, show the real component; if not, redirect them to the login page instead.

**Handle the "no one logged in" case using React Router:**

```jsx
{
  this.state.userIsLoggedIn
    ? <Route path="/users/:id" component={UserDetail} />
    : <Redirect path="/users/:id" to="/login-register" />
}
```

When userIsLoggedIn is true, React Router renders UserDetail as normal. When it's false, any attempt to visit /users/:id silently redirects to the login page. Updating this.state.userIsLoggedIn after login or logout causes an immediate re-render — and all protected routes respond instantly.

### Notifying components to refresh their models

- State management is ideal for this
- Callbacks are also acceptable for simpler cases

After a user logs in, every component that was blocked by authentication needs to re-fetch its data. After a user logs out, every component needs to discard its data. How do you trigger this cascade?

This is exactly what a state management system is designed to handle. When the login action completes, the state manager updates the session state — and every subscribed component re-renders and re-fetches automatically. For simpler apps without a full state manager, you can achieve the same effect with callbacks passed down from the top-level component, though this becomes unwieldy as the app grows.