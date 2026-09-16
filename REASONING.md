# Support Queue - Reasoning

## 1. Understanding the Problem

The helpdesk receives a large number of support tickets. Each ticket has a
priority and a promised response time.

The main problem is to make sure that the most pressing unresolved ticket
is always shown at the top of the queue.

From the problem statement, I identified these requirements:

- Tickets can be urgent or normal.
- Urgent tickets require a response within 2 hours.
- Normal tickets require a response within 24 hours.
- Unresolved tickets whose deadline has passed are overdue.
- Overdue tickets should move to the front of the queue.
- Tickets should be searchable by customer name.
- Priya should be able to view tickets assigned to her.
- Urgent and overdue tickets should be filterable.
- The ticket list should support pagination.
- Ticket status should be changeable.

---

## 2. Queue Priority

The most important part of the application is deciding which ticket should
appear first.

I implemented the queue using the following priority order:

1. Overdue unresolved tickets
2. Urgent tickets
3. Normal tickets

If two tickets have the same priority, the ticket with the earlier response
deadline is placed first.

This allows the application to automatically determine the most pressing
ticket instead of requiring Priya to manually reorder the queue.

---

## 3. Overdue Detection

A ticket is considered overdue when:

- Its response deadline has passed.
- Its status is not resolved.

The overdue state is calculated using the current time.

I chose dynamic calculation instead of storing a permanent overdue value.
This means a ticket automatically becomes overdue when its deadline passes.

---

## 4. Response Deadlines

When a new ticket is created, its response deadline is calculated
automatically based on its priority.

- Urgent ticket: current time + 2 hours
- Normal ticket: current time + 24 hours

This follows the response-time requirements from the problem statement.

---

## 5. Search and Filtering

The application provides a search field that allows the user to find
tickets by customer name.

The dashboard also provides filters for:

- All tickets
- Overdue tickets
- Tickets assigned to Priya
- Urgent tickets

These features help the helpdesk quickly find the tickets they need to work
on.

---

## 6. Ticket Status

Tickets have three statuses:

- Open
- In Progress
- Resolved

When a ticket is resolved, it is no longer considered overdue.

This prevents completed tickets from appearing as pending work.

---

## 7. Pagination

The helpdesk may contain a large number of tickets.

Instead of displaying every ticket at once, the application displays a
limited number of tickets per page.

The user can move between pages using pagination controls.

This keeps the interface easier to navigate as the number of tickets grows.

---

## 8. Technology Choice

I used React with JavaScript and Vite for the application.

React was chosen because the application contains several interactive
parts such as ticket creation, filtering, searching, sorting, status
updates and pagination.

CSS was used for the user interface.

I used browser localStorage for persistence. This allows tickets to remain
available after refreshing the browser without requiring a separate backend
or database.

---

## 9. Application Flow

The main application flow is:

1. Create or load tickets.
2. Calculate whether each unresolved ticket is overdue.
3. Apply search and filters.
4. Sort the remaining tickets according to queue priority.
5. Apply pagination.
6. Display the tickets.
7. Show the highest-priority ticket as the next ticket.

This keeps the queue logic centralized and ensures that the most pressing
ticket is displayed first.

---

## 10. Trade-offs

Because this was a time-limited assessment, I focused on the core
requirements instead of adding unnecessary complexity.

A production version could use:

- A backend API
- A database
- User authentication
- Role-based access control
- Server-side pagination
- Notifications
- Multiple helpdesk users

For this assessment, localStorage provides enough persistence to demonstrate
the core ticket-management workflow while keeping the implementation simple
and reliable.

---

## 11. Final Result

The final application provides a simple helpdesk dashboard where tickets
can be created, searched, filtered, sorted, updated and paginated.

The central queue logic ensures that overdue unresolved tickets appear
first, followed by urgent tickets and then normal tickets, with earlier
deadlines taking priority within the same category.