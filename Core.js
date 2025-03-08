class Heap {
    constructor() {
        this.heap = [];
    }
    isEmpty = () => this.heap.length === 0;
    add_new_element = (num) => {
        this.heap.push(num);
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex][0] >= this.heap[index][0]) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }
    max_pop = () => {
        let top = this.heap[0];
        let tmp = this.heap.pop();
        if (!this.isEmpty()) {
            this.heap[0] = tmp;
            this.sinkdown(0);
        }
        return top;
    }
    sinkdown = (index) => {
        let left = 2 * index + 1, right = 2 * index + 2, large = index;
        if (left < this.heap.length && this.heap[left][0] > this.heap[large][0]) large = left;
        if (right < this.heap.length && this.heap[right][0] > this.heap[large][0]) large = right;
        if (large !== index) {
            [this.heap[index], this.heap[large]] = [this.heap[large], this.heap[index]];
            this.sinkdown(large);
        }
    }
}

function settleExpenses(expenses, names) {
    let n = expenses.length;
    let totalSpent = expenses.reduce((sum, e) => sum + e, 0);
    let equalShare = totalSpent / n;
    let balances = expenses.map(e => e - equalShare);

    let pos_heap = new Heap(), neg_heap = new Heap();
    balances.forEach((balance, i) => {
        if (balance > 0) pos_heap.add_new_element([balance, i]);
        else if (balance < 0) neg_heap.add_new_element([-balance, i]);
    });

    let transactions = [];
    while (!pos_heap.isEmpty() && !neg_heap.isEmpty()) {
        let creditor = pos_heap.max_pop();
        let debtor = neg_heap.max_pop();
        let amount = Math.min(creditor[0], debtor[0]);

        transactions.push({ from: names[debtor[1]], to: names[creditor[1]], amount: amount.toFixed(2) });
        if (creditor[0] > debtor[0]) pos_heap.add_new_element([creditor[0] - amount, creditor[1]]);
        else if (creditor[0] < debtor[0]) neg_heap.add_new_element([debtor[0] - amount, debtor[1]]);
    }
    return { transactions, expenses, names };
}

// Web Application Integration
function handleExpenseCalculation() {
    let inputElements = document.querySelectorAll(".expense-input");
    let nameElements = document.querySelectorAll(".name-input");
    let expenses = Array.from(inputElements).map(input => parseFloat(input.value) || 0);
    let names = Array.from(nameElements).map(input => input.value.trim() || "Unknown");
    let resultData = settleExpenses(expenses, names);
    displayResults(resultData.transactions, resultData.expenses, resultData.names);
}

function displayResults(transactions, expenses, names) {
    let resultContainer = document.getElementById("results");
    resultContainer.innerHTML = "";
    
    let paymentsHeader = document.createElement("h3");
    paymentsHeader.textContent = "Payments Made:";
    resultContainer.appendChild(paymentsHeader);
    
    expenses.forEach((amount, i) => {
        let paymentEntry = document.createElement("p");
        paymentEntry.textContent = `${names[i]} paid $${amount.toFixed(2)}`;
        resultContainer.appendChild(paymentEntry);
    });
    
    let transactionsHeader = document.createElement("h3");
    transactionsHeader.textContent = "Settlements:";
    resultContainer.appendChild(transactionsHeader);
    
    transactions.forEach(trx => {
        let entry = document.createElement("p");
        entry.textContent = `${trx.from} pays ${trx.to} $${trx.amount}`;
        resultContainer.appendChild(entry);
    });
}

document.getElementById("calculate-btn").addEventListener("click", handleExpenseCalculation);
