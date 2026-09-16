import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialTickets = [
  {
    id: 1,
    customer: "ABC Corporation",
    title: "Laptop won't boot before client demo",
    priority: "urgent",
    deadline: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: "open",
    assignedTo: "Priya",
  },
  {
    id: 2,
    customer: "Tech Solutions",
    title: "VPN is not working",
    priority: "urgent",
    deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: "open",
    assignedTo: "Rahul",
  },
  {
    id: 3,
    customer: "Startup Hub",
    title: "Request for bigger monitor",
    priority: "normal",
    deadline: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    status: "open",
    assignedTo: "Priya",
  },
  {
    id: 4,
    customer: "Global Ltd",
    title: "Email access issue",
    priority: "normal",
    deadline: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: "open",
    assignedTo: "Rahul",
  },
  {
    id: 5,
    customer: "ABC Corporation",
    title: "Software installation request",
    priority: "normal",
    deadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    status: "open",
    assignedTo: "Priya",
  },
];

function isOverdue(ticket) {
  return (
    ticket.status !== "resolved" &&
    new Date(ticket.deadline).getTime() < Date.now()
  );
}

function getPriorityRank(ticket) {
  if (isOverdue(ticket)) return 0;
  if (ticket.priority === "urgent") return 1;
  return 2;
}

function formatDeadline(date) {
  return new Date(date).toLocaleString([], {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function App() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("supportTickets");
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    title: "",
    priority: "normal",
    assignedTo: "Priya",
  });

  const ticketsPerPage = 5;

  useEffect(() => {
    localStorage.setItem("supportTickets", JSON.stringify(tickets));
  }, [tickets]);

  const sortedTickets = useMemo(() => {
    let result = [...tickets];

    result = result.filter((ticket) =>
      ticket.customer.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "overdue") {
      result = result.filter(isOverdue);
    }

    if (filter === "my") {
      result = result.filter((ticket) => ticket.assignedTo === "Priya");
    }

    if (filter === "urgent") {
      result = result.filter((ticket) => ticket.priority === "urgent");
    }

    result.sort((a, b) => {
      const priorityDifference =
        getPriorityRank(a) - getPriorityRank(b);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        new Date(a.deadline).getTime() -
        new Date(b.deadline).getTime()
      );
    });

    return result;
  }, [tickets, search, filter]);

  const nextTicket = sortedTickets[0];

  const totalPages = Math.ceil(
    sortedTickets.length / ticketsPerPage
  );

  const displayedTickets = sortedTickets.slice(
    (page - 1) * ticketsPerPage,
    page * ticketsPerPage
  );

  const overdueCount = tickets.filter(isOverdue).length;

  const urgentCount = tickets.filter(
    (ticket) =>
      ticket.priority === "urgent" &&
      !isOverdue(ticket) &&
      ticket.status !== "resolved"
  ).length;

  const myTicketsCount = tickets.filter(
    (ticket) =>
      ticket.assignedTo === "Priya" &&
      ticket.status !== "resolved"
  ).length;

  function handleFormChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function addTicket(e) {
    e.preventDefault();

    if (!form.customer || !form.title) return;

    const hours = form.priority === "urgent" ? 2 : 24;

    const newTicket = {
      id: Date.now(),
      customer: form.customer,
      title: form.title,
      priority: form.priority,
      deadline: new Date(
        Date.now() + hours * 60 * 60 * 1000
      ).toISOString(),
      status: "open",
      assignedTo: form.assignedTo,
    };

    setTickets((prev) => [newTicket, ...prev]);

    setForm({
      customer: "",
      title: "",
      priority: "normal",
      assignedTo: "Priya",
    });

    setShowForm(false);
    setPage(1);
  }

  function updateStatus(id, status) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status }
          : ticket
      )
    );
  }

  function resetDemoData() {
    setTickets(initialTickets);
    localStorage.removeItem("supportTickets");
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Support Queue</h1>
          <p>IT Helpdesk Ticket Management</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + New Ticket
        </button>
      </header>

      <main>
        <section className="stats">
          <div className="stat-card">
            <span>Total Tickets</span>
            <strong>{tickets.length}</strong>
          </div>

          <div className="stat-card overdue-card">
            <span>Overdue</span>
            <strong>{overdueCount}</strong>
          </div>

          <div className="stat-card">
            <span>My Tickets</span>
            <strong>{myTicketsCount}</strong>
          </div>

          <div className="stat-card">
            <span>Urgent</span>
            <strong>{urgentCount}</strong>
          </div>
        </section>

        {showForm && (
          <section className="form-card">
            <h2>Create New Ticket</h2>

            <form onSubmit={addTicket}>
              <input
                name="customer"
                placeholder="Customer name"
                value={form.customer}
                onChange={handleFormChange}
              />

              <input
                name="title"
                placeholder="Issue / ticket title"
                value={form.title}
                onChange={handleFormChange}
              />

              <select
                name="priority"
                value={form.priority}
                onChange={handleFormChange}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleFormChange}
              >
                <option value="Priya">Priya</option>
                <option value="Rahul">Rahul</option>
              </select>

              <button className="primary-btn" type="submit">
                Create Ticket
              </button>
            </form>

            <small>
              Urgent tickets get a 2-hour response deadline.
              Normal tickets get a 24-hour response deadline.
            </small>
          </section>
        )}

        {nextTicket && (
          <section className="next-ticket">
            <div className="section-title">
              <h2>Next Ticket</h2>
              <span className="next-label">MOST PRESSING</span>
            </div>

            <div className="next-content">
              <div>
                <span
                  className={`badge ${
                    isOverdue(nextTicket)
                      ? "overdue"
                      : nextTicket.priority
                  }`}
                >
                  {isOverdue(nextTicket)
                    ? "OVERDUE"
                    : nextTicket.priority.toUpperCase()}
                </span>

                <h3>{nextTicket.title}</h3>

                <p>
                  Customer: <strong>{nextTicket.customer}</strong>
                </p>

                <p>
                  Assigned to:{" "}
                  <strong>{nextTicket.assignedTo}</strong>
                </p>

                <p>
                  Response due:{" "}
                  <strong>
                    {formatDeadline(nextTicket.deadline)}
                  </strong>
                </p>
              </div>

              <div>
                <select
                  value={nextTicket.status}
                  onChange={(e) =>
                    updateStatus(nextTicket.id, e.target.value)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in-progress">
                    In Progress
                  </option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </section>
        )}

        <section className="tickets-section">
          <div className="toolbar">
            <input
              className="search"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Tickets</option>
              <option value="overdue">Overdue</option>
              <option value="my">My Tickets</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="section-title">
            <h2>All Tickets</h2>

            <button
              className="reset-btn"
              onClick={resetDemoData}
            >
              Reset Demo
            </button>
          </div>

          <div className="ticket-list">
            {displayedTickets.length === 0 ? (
              <div className="empty">
                No tickets found.
              </div>
            ) : (
              displayedTickets.map((ticket) => (
                <div className="ticket" key={ticket.id}>
                  <div className="ticket-main">
                    <span
                      className={`badge ${
                        isOverdue(ticket)
                          ? "overdue"
                          : ticket.priority
                      }`}
                    >
                      {isOverdue(ticket)
                        ? "OVERDUE"
                        : ticket.priority.toUpperCase()}
                    </span>

                    <h3>{ticket.title}</h3>

                    <p>{ticket.customer}</p>
                  </div>

                  <div className="ticket-info">
                    <span>
                      Due: {formatDeadline(ticket.deadline)}
                    </span>

                    <span>
                      Assigned: {ticket.assignedTo}
                    </span>

                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        updateStatus(
                          ticket.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">
                        In Progress
                      </option>
                      <option value="resolved">
                        Resolved
                      </option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </main>

      <footer>
        Support Queue • Built for Auriga IT Builder Round
      </footer>
    </div>
  );
}

export default App;