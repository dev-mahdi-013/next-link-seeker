# LinkedIn Search

A simple full-stack web application for searching and filtering LinkedIn profile data.

This project was developed as a technical assessment for the **Full-Stack Developer** position at Cyberyan.

## Overview

The application provides a simple interface for searching a dataset of LinkedIn profiles.

Users can:

* Search profiles using a keyword
* Filter results by company
* Filter results by location
* View paginated search results
* Use infinite scrolling on mobile devices
* View statistics about the dataset

The main focus of the project is the search logic, frontend/backend communication, clean API usage, and a simple maintainable structure rather than visual complexity.

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* TanStack React Query
* Axios
* Lucide React
* Recharts

### Backend

The frontend communicates with a REST API backend.

The API base URL is configured using:

```env
NEXT_PUBLIC_API_URL=https://nest-new-link-seeker.vercel.app/api
```

## Project Structure

```text
.
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── stats/
│       └── page.tsx
│
├── components/
│   ├── HomeClient.tsx
│   ├── SearchBar.tsx
│   ├── ResultsTable.tsx
│   ├── ServerResults.tsx
│   ├── StatsSection.tsx
│   ├── CompactCompanies.tsx
│   ├── CompactEducation.tsx
│   ├── CompactSkills.tsx
│   ├── CompactSummary.tsx
│   ├── ExperienceSection.tsx
│   └── ...
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useDebouncedSearch.ts
│   ├── useInfiniteSearch.ts
│   ├── useIsMobile.ts
│   └── useSearch.ts
│
├── lib/
│   ├── api.ts
│   ├── server-api.ts
│   └── constants.ts
│
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## Search API

The frontend uses the following API endpoints:

### Search Users

```http
GET /users/search
```

Supported query parameters include:

```text
keyword
industry
skill
company
location
page
limit
```

Example:

```text
/users/search?keyword=developer&company=Google&location=Amsterdam&page=1&limit=10
```

The API response is expected to contain the search results together with pagination metadata:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 300,
    "totalPages": 30
  }
}
```

## Filters

The frontend currently provides the following filters:

### Company

Search profiles based on their company.

```text
company
```

### Location

Search profiles based on geographical location.

```text
location
```

The API layer and search hooks also support:

```text
skill
industry
```

This makes it possible to extend the UI with additional filters without changing the API architecture.

## Search Behavior

Search input is debounced by **300ms** before sending requests to the backend.

This prevents sending an API request for every individual keystroke and reduces unnecessary backend requests.

The same debounce mechanism is applied to:

* Keyword
* Skill
* Company
* Location

## Pagination

Desktop users receive traditional paginated results.

The frontend sends:

```text
page
limit
```

to the backend and uses the returned pagination metadata to navigate between pages.

On mobile devices, the application uses **infinite scrolling**.

When the user approaches the bottom of the results list, the next page is automatically requested.

## Responsive Search

The search experience is adapted for different screen sizes.

### Desktop

* Paginated results
* Page navigation
* Search and filter interface

### Mobile

* Infinite scrolling
* Automatic loading of the next page
* Optimized result loading behavior

## Data Model

The frontend expects each LinkedIn profile to contain information such as:

```text
id
full_name
first_name
last_name
gender
industry
job_title
job_company_name
location_name
location_country
linkedin_connections
inferred_salary
inferred_years_experience
summary
skills
experience
emails
phone_numbers
linkedin_url
github_username
twitter_username
```

The exact storage implementation is handled by the backend.

## Statistics

The application also provides a statistics page.

The frontend consumes:

```http
GET /users/statistics
```

The statistics response includes information such as:

* Total users
* Industries
* Countries
* Top companies
* Salary ranges
* Gender distribution

These values are visualized in the `/stats` page.

## Server-Side Rendering

The initial search page is also fetched on the server.

The application uses:

```text
getInitialResults()
```

to retrieve the first page of results.

This provides real initial content before the client-side application becomes interactive.

The page also uses a revalidation period of 60 seconds:

```ts
export const revalidate = 60;
```

## Client-Side Data Fetching

TanStack React Query is used for client-side API requests.

Two different search strategies are implemented:

```text
useDebouncedSearch
```

for normal pagination, and:

```text
useInfiniteSearch
```

for mobile infinite scrolling.

This keeps the data-fetching logic separate from the UI components.

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://nest-new-link-seeker.vercel.app/api
```

For local backend development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Run development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### 4. Production build

```bash
npm run build
```

### 5. Start production server

```bash
npm run start
```

## Architecture

The frontend follows a simple layered structure:

```text
User
 │
 ▼
SearchBar
 │
 ▼
HomeClient
 │
 ├── useDebouncedSearch
 │
 └── useInfiniteSearch
 │
 ▼
searchApi
 │
 ▼
REST API
 │
 ▼
Backend
 │
 ▼
LinkedIn Dataset
```

The UI components are responsible for presentation, while the search hooks handle state and data fetching.

The API communication is centralized in:

```text
lib/api.ts
```

This makes the frontend easier to maintain and extend.

## Main Features

* Keyword search
* Company filtering
* Location filtering
* Skill and industry API support
* Debounced search
* Pagination
* Mobile infinite scrolling
* Server-side initial data fetching
* Responsive UI
* Statistics dashboard
* React Query caching
* TypeScript type safety
* Centralized API client

## Assessment Requirements

The implementation addresses the main requirements of the technical assessment:

| Requirement            | Status                 |
| ---------------------- | ---------------------- |
| Keyword search         | ✅                      |
| At least 2 filters     | ✅                      |
| Search API integration | ✅                      |
| Search result list     | ✅                      |
| Pagination             | ✅                      |
| Responsive frontend    | ✅                      |
| Data/API structure     | ✅                      |
| Search preparation     | Backend responsibility |
| README/documentation   | ✅                      |

## Notes

The project intentionally keeps the UI simple and focuses primarily on functionality, search behavior, API communication, and maintainable code structure.

The backend is responsible for the actual dataset storage and search implementation, while the frontend provides the search interface and consumes the REST API.
