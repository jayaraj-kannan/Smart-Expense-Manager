<template>
    <div class="dashboard">
        <h1>Expense Report</h1>
        <div class="summary">
            <div class="summary-item">
                <h2>Total Income</h2>
                <p>$5000</p>
            </div>
            <div class="summary-item">
                <h2>Total Expenses</h2>
                <p>$3000</p>
            </div>
            <div class="summary-item">
                <h2>Net Savings</h2>
                <p>$2000</p>
            </div>
        </div>
        <div class="expense-list">
            <h2>Recent Expenses</h2>
            <ul>
                <li>Groceries: $200</li>
                <li>Rent: $1000</li>
                <li>Utilities: $150</li>
                <li>Entertainment: $100</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dashboard'
}
</script>

<style scoped>
.dashboard {
    padding: 20px;
}

.summary {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.summary-item {
    text-align: center;
}

.expense-list ul {
    list-style-type: none;
    padding: 0;
}

.expense-list li {
    margin: 5px 0;
}
</style>