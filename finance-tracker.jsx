import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Education", "Other"];

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

const THEMES = [
  { name: "Dark Gold", bg: "#0a0a0f", card: "#13131a", accent: "#FFD700", text: "#fff" },
  { name: "Ocean", bg: "#0d1b2a", card: "#1b263b", accent: "#00b4d8", text: "#fff" },
  { name: "Forest", bg: "#0f2017", card: "#1a3328", accent: "#52b788", text: "#fff" },
  { name: "Purple Night", bg: "#100b1e", card: "#1e1533", accent: "#c77dff", text: "#fff" },
];

const initialTransactions = [
  { id: 1, title: "Salary", amount: 50000, type: "income", category: "Other", date: "2026-05-01" },
  { id: 2, title: "Rent", amount: 12000, type: "expense", category: "Bills", date: "2026-05-02" },
  { id: 3, title: "Groceries", amount: 3500, type: "expense", category: "Food", date: "2026-05-05" },
  { id: 4, title: "Netflix", amount: 649, type: "expense", category: "Entertainment", date: "2026-05-06" },
  { id: 5, title: "Freelance", amount: 15000, type: "income", category: "Other", date: "2026-05-08" },
  { id: 6, title: "Petrol", amount: 2000, type: "expense", category: "Transport", date: "2026-05-10" },
];

const initialGoals = [
  { id: 1, name: "Emergency Fund", target: 100000, saved: 45000, color: "#FF6B6B" },
  { id: 2, name: "New Laptop", target: 80000, saved: 32000, color: "#4ECDC4" },
  { id: 3, name: "Vacation", target: 50000, saved: 18000, color: "#FFEAA7" },
];

export default function FinanceTracker() {
  const [tab, setTab] = useState("dashboard");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [goals, setGoals] = useState(initialGoals);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [theme, setTheme] = useState(THEMES[0]);
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().split("T")[0] });
  const [goalForm, setGoalForm] = useState({ name: "", target: "", saved: "", color: "#FF6B6B" });
  const [filter, setFilter] = useState("all");
  const [animate, setAnimate] = useState(false);

  useEffect(() => { setAnimate(true); setTimeout(() => setAnimate(false), 600); }, [tab]);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseByCategory = CATEGORIES.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.type === "expense" && t.category === cat).reduce((a, b) => a + b.amount, 0)
  })).filter(c => c.value > 0);

  const monthlyData = [
    { month: "Jan", income: 45000, expense: 28000 },
    { month: "Feb", income: 48000, expense: 31000 },
    { month: "Mar", income: 52000, expense: 35000 },
    { month: "Apr", income: 49000, expense: 29000 },
    { month: "May", income: totalIncome, expense: totalExpense },
  ];

  const filteredTx = transactions.filter(t => filter === "all" ? true : t.type === filter);

  const addTransaction = () => {
    if (!form.title || !form.amount) return;
    setTransactions([...transactions, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    setForm({ title: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().split("T")[0] });
    setShowAddTx(false);
  };

  const addGoal = () => {
    if (!goalForm.name || !goalForm.target) return;
    setGoals([...goals, { ...goalForm, id: Date.now(), target: Number(goalForm.target), saved: Number(goalForm.saved || 0) }]);
    setGoalForm({ name: "", target: "", saved: "", color: "#FF6B6B" });
    setShowAddGoal(false);
  };

  const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));

  const fmt = (n) => `${currency.symbol}${n.toLocaleString("en-IN")}`;

  const s = {
    app: { minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" },
    glow: { position: "fixed", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${theme.accent}22 0%, transparent 70%)`, top: -100, right: -100, pointerEvents: "none" },
    header: { background: theme.card, borderBottom: `1px solid ${theme.accent}33`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: 18, fontWeight: 800, color: theme.accent, letterSpacing: -0.5 },
    nav: { display: "flex", gap: 4, background: theme.bg, padding: "10px 16px", borderBottom: `1px solid ${theme.accent}22`, overflowX: "auto" },
    navBtn: (active) => ({ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.2s", background: active ? theme.accent : "transparent", color: active ? theme.bg : theme.text + "99", whiteSpace: "nowrap" }),
    content: { padding: "16px", paddingBottom: 100, transition: "all 0.3s", opacity: animate ? 0 : 1, transform: animate ? "translateY(10px)" : "translateY(0)" },
    card: { background: theme.card, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${theme.accent}22` },
    balanceCard: { background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accent}11)`, borderRadius: 20, padding: 20, marginBottom: 12, border: `1px solid ${theme.accent}44`, textAlign: "center" },
    statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 },
    statCard: (color) => ({ background: theme.card, borderRadius: 14, padding: 14, border: `1px solid ${color}44`, borderLeft: `3px solid ${color}` }),
    label: { fontSize: 11, color: theme.text + "66", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 },
    value: { fontSize: 22, fontWeight: 800, marginTop: 4 },
    sectionTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: theme.accent, letterSpacing: 0.5 },
    txItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${theme.accent}11` },
    badge: (type) => ({ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700, background: type === "income" ? "#52b78822" : "#FF6B6B22", color: type === "income" ? "#52b788" : "#FF6B6B" }),
    input: { width: "100%", background: theme.bg, border: `1px solid ${theme.accent}44`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 14, boxSizing: "border-box", marginBottom: 10 },
    select: { width: "100%", background: theme.bg, border: `1px solid ${theme.accent}44`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 14, boxSizing: "border-box", marginBottom: 10 },
    btn: (col) => ({ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: col || theme.accent, color: col ? "#fff" : theme.bg, fontWeight: 700, fontSize: 15, cursor: "pointer" }),
    modal: { position: "fixed", inset: 0, background: "#000a", zIndex: 200, display: "flex", alignItems: "flex-end" },
    modalBox: { background: theme.card, borderRadius: "20px 20px 0 0", padding: 20, width: "100%", border: `1px solid ${theme.accent}33` },
    progressBg: { background: theme.bg, borderRadius: 10, height: 8, marginTop: 8, overflow: "hidden" },
    progressFill: (pct, col) => ({ height: "100%", width: `${Math.min(pct, 100)}%`, background: col, borderRadius: 10, transition: "width 1s ease" }),
    fab: { position: "fixed", bottom: 80, right: 20, width: 52, height: 52, borderRadius: "50%", background: theme.accent, color: theme.bg, border: "none", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, boxShadow: `0 4px 20px ${theme.accent}66`, zIndex: 99 },
    deleteBtn: { background: "#FF6B6B22", border: "none", color: "#FF6B6B", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 },
    themeRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    themeChip: (active, t) => ({ padding: "8px 14px", borderRadius: 20, cursor: "pointer", border: active ? `2px solid ${t.accent}` : `1px solid ${t.accent}44`, background: t.card, color: t.accent, fontSize: 12, fontWeight: 600 }),
    currRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    currChip: (active) => ({ padding: "8px 14px", borderRadius: 20, cursor: "pointer", border: active ? `2px solid ${theme.accent}` : `1px solid ${theme.accent}44`, background: active ? theme.accent + "22" : "transparent", color: theme.text, fontSize: 12, fontWeight: 600 }),
  };

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={s.glow} />

      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>💰 FinTrack</div>
        <div style={{ fontSize: 12, color: theme.accent, fontWeight: 700 }}>Balance: {fmt(balance)}</div>
      </div>

      {/* Nav */}
      <div style={s.nav}>
        {["dashboard", "transactions", "goals", "charts", "settings"].map(t => (
          <button key={t} style={s.navBtn(tab === t)} onClick={() => setTab(t)}>
            {t === "dashboard" ? "🏠 Home" : t === "transactions" ? "💳 Transactions" : t === "goals" ? "🎯 Goals" : t === "charts" ? "📊 Charts" : "⚙️ Settings"}
          </button>
        ))}
      </div>

      <div style={s.content}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <div style={s.balanceCard}>
              <div style={{ ...s.label, color: theme.accent }}>Total Balance</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: theme.accent, marginTop: 4 }}>{fmt(balance)}</div>
              <div style={{ fontSize: 12, color: theme.text + "66", marginTop: 4 }}>May 2026</div>
            </div>

            <div style={s.statRow}>
              <div style={s.statCard("#52b788")}>
                <div style={s.label}>Income</div>
                <div style={{ ...s.value, color: "#52b788" }}>{fmt(totalIncome)}</div>
              </div>
              <div style={s.statCard("#FF6B6B")}>
                <div style={s.label}>Expenses</div>
                <div style={{ ...s.value, color: "#FF6B6B" }}>{fmt(totalExpense)}</div>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Savings Rate</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: theme.accent }}>
                {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
              </div>
              <div style={s.progressBg}>
                <div style={s.progressFill(totalIncome > 0 ? (balance / totalIncome) * 100 : 0, theme.accent)} />
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Recent Transactions</div>
              {transactions.slice(-4).reverse().map(tx => (
                <div key={tx.id} style={s.txItem}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.title}</div>
                    <div style={{ fontSize: 11, color: theme.text + "55" }}>{tx.category} · {tx.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: tx.type === "income" ? "#52b788" : "#FF6B6B" }}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </div>
                    <span style={s.badge(tx.type)}>{tx.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Goals Progress</div>
              {goals.map(g => (
                <div key={g.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{g.name}</span>
                    <span style={{ color: g.color, fontWeight: 700 }}>{Math.round((g.saved / g.target) * 100)}%</span>
                  </div>
                  <div style={{ fontSize: 11, color: theme.text + "55", marginBottom: 4 }}>{fmt(g.saved)} / {fmt(g.target)}</div>
                  <div style={s.progressBg}>
                    <div style={s.progressFill((g.saved / g.target) * 100, g.color)} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TRANSACTIONS */}
        {tab === "transactions" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["all", "income", "expense"].map(f => (
                <button key={f} style={{ ...s.navBtn(filter === f), flex: 1, borderRadius: 10 }} onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : f === "income" ? "✅ Income" : "🔴 Expense"}
                </button>
              ))}
            </div>

            <div style={s.card}>
              {filteredTx.length === 0 ? (
                <div style={{ textAlign: "center", color: theme.text + "44", padding: 20 }}>No transactions found</div>
              ) : filteredTx.reverse().map(tx => (
                <div key={tx.id} style={s.txItem}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.title}</div>
                    <div style={{ fontSize: 11, color: theme.text + "55" }}>{tx.category} · {tx.date}</div>
                  </div>
                  <div style={{ textAlign: "right", marginLeft: 10 }}>
                    <div style={{ fontWeight: 700, color: tx.type === "income" ? "#52b788" : "#FF6B6B", marginBottom: 4 }}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </div>
                    <button style={s.deleteBtn} onClick={() => deleteTransaction(tx.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* GOALS */}
        {tab === "goals" && (
          <>
            {goals.map(g => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <div key={g.id} style={{ ...s.card, borderLeft: `3px solid ${g.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{g.name}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: g.color }}>{pct}%</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: theme.text + "66", marginBottom: 8 }}>
                    <span>Saved: {fmt(g.saved)}</span>
                    <span>Target: {fmt(g.target)}</span>
                  </div>
                  <div style={s.progressBg}>
                    <div style={s.progressFill(pct, g.color)} />
                  </div>
                  <div style={{ fontSize: 11, color: theme.text + "55", marginTop: 6 }}>
                    Remaining: {fmt(g.target - g.saved)}
                  </div>
                </div>
              );
            })}

            <button style={s.btn()} onClick={() => setShowAddGoal(true)}>+ Add New Goal</button>
          </>
        )}

        {/* CHARTS */}
        {tab === "charts" && (
          <>
            <div style={s.card}>
              <div style={s.sectionTitle}>Expenses by Category</div>
              {expenseByCategory.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={expenseByCategory} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: theme.card, border: `1px solid ${theme.accent}44`, borderRadius: 8, color: theme.text }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {expenseByCategory.map((c, i) => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                        <span style={{ color: theme.text + "99" }}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <div style={{ color: theme.text + "44", textAlign: "center", padding: 20 }}>No expense data</div>}
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Monthly Overview</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.accent + "11"} />
                  <XAxis dataKey="month" tick={{ fill: theme.text + "77", fontSize: 11 }} />
                  <YAxis tick={{ fill: theme.text + "77", fontSize: 10 }} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: theme.card, border: `1px solid ${theme.accent}44`, borderRadius: 8, color: theme.text }} />
                  <Bar dataKey="income" fill="#52b788" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#FF6B6B" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Summary Stats</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Avg Daily Expense", value: fmt(Math.round(totalExpense / 30)) },
                  { label: "Total Transactions", value: transactions.length },
                  { label: "Biggest Expense", value: fmt(Math.max(...transactions.filter(t => t.type === "expense").map(t => t.amount))) },
                  { label: "Savings Rate", value: `${totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%` },
                ].map(s2 => (
                  <div key={s2.label} style={{ background: theme.bg, borderRadius: 10, padding: 10 }}>
                    <div style={{ fontSize: 10, color: theme.text + "55", fontWeight: 600 }}>{s2.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: theme.accent, marginTop: 2 }}>{s2.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <>
            <div style={s.card}>
              <div style={s.sectionTitle}>🎨 Color Theme</div>
              <div style={s.themeRow}>
                {THEMES.map(t => (
                  <div key={t.name} style={s.themeChip(theme.name === t.name, t)} onClick={() => setTheme(t)}>{t.name}</div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>💱 Currency</div>
              <div style={s.currRow}>
                {CURRENCIES.map(c => (
                  <div key={c.code} style={s.currChip(currency.code === c.code)} onClick={() => setCurrency(c)}>
                    {c.symbol} {c.code}
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>📊 Account Summary</div>
              {[
                { label: "Total Transactions", value: transactions.length },
                { label: "Total Income", value: fmt(totalIncome) },
                { label: "Total Expenses", value: fmt(totalExpense) },
                { label: "Net Balance", value: fmt(balance) },
                { label: "Active Goals", value: goals.length },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.accent}11`, fontSize: 14 }}>
                  <span style={{ color: theme.text + "77" }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: theme.accent }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>📤 Export Data</div>
              <button style={s.btn()} onClick={() => {
                const csv = ["Title,Amount,Type,Category,Date", ...transactions.map(t => `${t.title},${t.amount},${t.type},${t.category},${t.date}`)].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "transactions.csv"; a.click();
              }}>Export as CSV</button>
            </div>
          </>
        )}
      </div>

      {/* FAB */}
      {(tab === "dashboard" || tab === "transactions") && (
        <button style={s.fab} onClick={() => setShowAddTx(true)}>+</button>
      )}

      {/* Add Transaction Modal */}
      {showAddTx && (
        <div style={s.modal} onClick={() => setShowAddTx(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, color: theme.accent }}>Add Transaction</div>
            <input style={s.input} placeholder="Title (e.g. Salary)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input style={s.input} type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            <select style={s.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select style={s.select} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input style={s.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...s.btn("#666"), flex: 1 }} onClick={() => setShowAddTx(false)}>Cancel</button>
              <button style={{ ...s.btn(), flex: 1 }} onClick={addTransaction}>Add ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div style={s.modal} onClick={() => setShowAddGoal(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, color: theme.accent }}>Add Savings Goal</div>
            <input style={s.input} placeholder="Goal Name (e.g. New Phone)" value={goalForm.name} onChange={e => setGoalForm({ ...goalForm, name: e.target.value })} />
            <input style={s.input} type="number" placeholder="Target Amount" value={goalForm.target} onChange={e => setGoalForm({ ...goalForm, target: e.target.value })} />
            <input style={s.input} type="number" placeholder="Already Saved (optional)" value={goalForm.saved} onChange={e => setGoalForm({ ...goalForm, saved: e.target.value })} />
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: theme.text + "66", marginBottom: 6 }}>Color</div>
              <div style={{ display: "flex", gap: 8 }}>
                {COLORS.slice(0, 6).map(c => (
                  <div key={c} onClick={() => setGoalForm({ ...goalForm, color: c })} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: goalForm.color === c ? "3px solid white" : "2px solid transparent" }} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...s.btn("#666"), flex: 1 }} onClick={() => setShowAddGoal(false)}>Cancel</button>
              <button style={{ ...s.btn(), flex: 1 }} onClick={addGoal}>Add Goal ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
