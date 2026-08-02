# Enhance Malaysian Companies Database Exporter

Transform the static `malaysian_companies_database_exporter.html` script into a modern, full-stack data-driven web application. This enhancement will migrate procedural data generation into a persistent database, establish a scalable backend API, modernize the frontend UI with a robust framework, and introduce interactive data visualizations.

## Proposed Changes

We will restructure the project into a cohesive full-stack repository. 

### Phase 1: Data Preparation & Database Setup

- Extract the data generation logic (`generateData`) from the HTML script into a dedicated backend seed script.
- Set up PostgreSQL and define the schema (Models) using Prisma.
  - Fields: `id`, `rank`, `company`, `sector`, `marketCap`, `revenue`, `profit`, `employees`.
- Add database indexes to `company` (for search), `sector` (for filtering), and `marketCap` / `revenue` (for sorting).
- Write a script to seed the 1,000 rows into the database automatically.

### Phase 2: Backend Development (Next.js API)

- Create a Next.js API route: `GET /api/companies`.
- **Server-Side Pagination:** Implement limit and offset logic so the client only loads a chunk of data (e.g., 50 rows per page) instead of all 1,000 at once.
- **Server-Side Filtering & Sorting:** Add query parameter support to filter by `sector` and `search` term, and sort by any column dynamically.
- **Data Formatting:** Ensure the API returns structured, strongly-typed JSON.

### Phase 3: Frontend UI/UX (React + Tailwind CSS)

- Initialize a Next.js project with Tailwind CSS.
- **Design System:** Migrate the existing "light blue and white" styles into reusable Tailwind configuration and CSS variables.
- **Main Data Table Component:** Convert the HTML table into a responsive React component.
- **Interactivity:** Wire up the search bar, sector dropdown, and column headers to trigger API calls seamlessly.
- **Loading States:** Implement skeleton loaders to display while data is being fetched.
- **Mobile Responsiveness:** Ensure the table container supports horizontal scrolling on mobile without breaking the page layout.
- **Formatters:** Centralize number formatting (e.g., `RM 1.5 B`, `15,000` employees) using utility functions.

### Phase 4: Data Visualization

- Install **Recharts** (a composable charting library built on React components).
- **Dashboard Header:** Add a summary section above the table.
- **Sector Breakdown Chart:** Implement a Doughnut chart showing the percentage distribution of companies across different sectors.
- **Financial Performance Chart:** Implement a Bar or Scatter chart comparing Revenue vs. Profit for the top 10 companies.

## Verification Plan

### Automated Tests
- Run database seeding script and verify 1,000 rows are successfully inserted.
- Test API endpoints using HTTP requests to ensure pagination and filtering return the correct data subsets.

### Manual Verification
- Start the Next.js development server (`npm run dev`).
- Verify the UI renders correctly across desktop and mobile views.
- Test the search, filter, and sort functionalities to ensure they update the table and trigger loading states appropriately.
- Verify the Recharts visualizations render accurately based on the filtered dataset.
