# AI LOGS

## 1. Understanding the Problem

### User
I need to build a support queue application for an IT helpdesk. The helpdesk
receives urgent and normal tickets. Urgent tickets need a response within
2 hours, while normal tickets need a response within 24 hours. Overdue
tickets should automatically move to the front.

### AI
The core requirement is a priority-based ticket queue. I would implement
the queue using these rules:

1. Overdue unresolved tickets come first.
2. Urgent tickets come next.
3. Normal tickets come after urgent tickets.
4. Within the same priority, the earliest deadline comes first.

The application should also provide search, filters, assignment information,
status management, and pagination.

---

## 2. Choosing the Technology

### User
Which technology should I use? I have limited time.

### AI
Since the application needs to be completed quickly, React with JavaScript
and CSS is sufficient.

For persistence, localStorage can be used instead of setting up a backend
and database. This reduces setup time while still allowing the application
to preserve tickets after refreshing the browser.

Suggested stack:

- React
- JavaScript
- CSS
- Vite
- LocalStorage

---

## 3. Designing the Ticket Data

### User
What information should each ticket contain?

### AI
Each ticket should contain information such as:

- Customer name
- Issue description
- Priority
- Assigned person
- Status
- Creation time
- Response deadline

Example:

{
  customer: "Rahul",
  issue: "Laptop won't boot",
  priority: "urgent",
  assignedTo: "Priya",
  status: "open",
  deadline: "..."
}

---

## 4. Overdue Logic

### User
How should I detect whether a ticket is overdue?

### AI
An unresolved ticket is overdue when its response deadline is earlier than
the current time.

The important part is that overdue status should be calculated dynamically.
There is no need to permanently store an `overdue: true` value.

Conceptually:

if ticket is not resolved
AND deadline has passed
THEN ticket is overdue.

---

## 5. Queue Sorting

### User
How can I make sure the most important ticket appears first?

### AI
Create a priority rank for every ticket.

For example:

- Overdue unresolved = 0
- Urgent = 1
- Normal = 2

Then sort tickets by this rank. If two tickets have the same rank, compare
their deadlines and put the earlier deadline first.

This produces a queue where the most pressing work appears at the top.

---

## 6. Search

### User
The helpdesk needs to find a customer's ticket by name. How should I do it?

### AI
Add a search input and filter the ticket list based on the customer's name.

The comparison can be case-insensitive so that searching for `rahul` also
finds `Rahul`.

---

## 7. Filters

### User
What filters should I add?

### AI
The useful filters from the requirements are:

- All tickets
- Overdue tickets
- Tickets assigned to Priya
- Urgent tickets

These filters can be applied before pagination.

---

## 8. Pagination

### User
How should pagination work?

### AI
Instead of displaying every ticket simultaneously, divide the filtered
tickets into pages.

For example, display 5 tickets per page.

Calculate the starting position using:

startIndex = (currentPage - 1) * ticketsPerPage

Then display the tickets from that position up to the page size.

---

## 9. Status Management

### User
Should tickets have different statuses?

### AI
Yes. A simple status system can contain:

- Open
- In Progress
- Resolved

When a ticket becomes resolved, it should no longer be considered overdue.

---

## 10. Adding Tickets

### User
How should new tickets get their deadline?

### AI
The deadline can be calculated automatically when the ticket is created.

For an urgent ticket:

deadline = current time + 2 hours

For a normal ticket:

deadline = current time + 24 hours

This avoids requiring the user to manually calculate the response deadline.

---

## 11. Persistence

### User
I don't want tickets to disappear when I refresh the page.

### AI
Use browser localStorage.

Whenever tickets change, save them to localStorage. When the application
starts, read the stored tickets and use them as the initial state.

This provides simple persistence without requiring a database.

---

## 12. UI Structure

### User
How should I structure the dashboard?

### AI
A simple dashboard can contain:

1. Header
2. Statistics cards
3. Add ticket form
4. "Next Ticket" section
5. Search and filters
6. Ticket list
7. Pagination controls

The "Next Ticket" section should clearly show the ticket currently at the
top of the priority queue.

---

## 13. Testing

### User
What should I test before submitting?

### AI
Test the main requirements:

- Create an urgent ticket.
- Create a normal ticket.
- Check automatic deadlines.
- Check overdue tickets.
- Check that overdue tickets move to the top.
- Search by customer name.
- Filter urgent tickets.
- Filter overdue tickets.
- Filter tickets assigned to Priya.
- Change ticket status.
- Resolve a ticket and verify it is no longer overdue.
- Move between pages.
- Refresh the browser and verify data persists.

---

## 14. Documentation

### User
What documentation should I include?

### AI
Include:

### README.md
Explain:

- What the project does
- Features
- Technology stack
- Installation
- How to run it
- Queue priority rules
- Persistence

### REASONING.md
Explain:

- How you interpreted the requirements
- Queue ordering
- Overdue detection
- Search and filtering
- Pagination
- Technology decisions
- Trade-offs

### AI_LOGS.md
Keep a record of the AI interaction used during development.

---

## 15. Final Review

### User
What should I check before submitting?

### AI
Make sure:

- The application runs successfully.
- No major console errors exist.
- README.md exists.
- REASONING.md exists.
- AI_LOGS.md exists.
- All required files are pushed to GitHub.
- The repository is public if required.
- The submitted GitHub URL points to the correct repository.

The important thing is to verify the core helpdesk workflow rather than
spending the remaining time adding unnecessary features.