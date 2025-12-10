import React, { useEffect, useState } from 'react';
import "./App.css";

function App() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchInvoices();

    const interval = setInterval(() => {
      fetchInvoices();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchInvoices = () => {
    fetch("http://localhost:3001/api/invoices")
      .then(res => res.json())
      .then(data => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  
  const sendTestInvoice = () => {
    const testInvoice = { 
      vendor: "HOME DEP0T", 
      amount: 450, 
      date: "2024-05-12" 
    };

    fetch("http://localhost:3001/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testInvoice)
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          setErrorMessage(err.error || "Unknown error");
          throw new Error(err.error);
        }
      })
      .then(() => fetchInvoices())
      .catch(err => console.error(err));
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <img src="/ras.png" alt="Logo" className="logo" />
        <div>
          <h1>Framing Invoice Digitizer</h1>
          <p>Ron Anderson & Sons Ltd.</p>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {/* Upload Section */}
        <section className="upload-section">
          <h2>Send Test Invoice to Workflow</h2>
          <button onClick={sendTestInvoice}>Send</button>
        </section>

        {errorMessage && (
          <div className="error-popup">
            {errorMessage}
            <button onClick={() => setErrorMessage(null)}>✕</button>
          </div>
        )}

        {/* Invoice Feed */}
        <section className="invoice-feed">
          <h2>Invoices</h2>
          <div className="invoice-header-row">
            <span>Date</span>
            <span>Vendor</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : invoices.length === 0 ? (
            <p>No invoices yet</p>
          ) : (
            <div className="invoice-list">
              {invoices.map((inv) => (
                <div className="invoice-row" key={inv.id}>
                        <span>{inv.date}</span>
                        <span>{inv.vendor}</span>
                        <span>{inv.amount}</span>
                        <span>{inv.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      
        {/* Download Report */}
        <section className="download-section">
          <h2>Download the CSV Report</h2>
          <button 
            onClick={() => 
              window.open("http://localhost:3001/api/csv-export", "_blank")
            }
          >
            Download
          </button>
        </section> 
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <p>@DevonVickery 2025</p>
      </footer>
    </div>
  );
}

export default App;