document.addEventListener("DOMContentLoaded", () => {
    // Retrieve investments from localStorage or initialize as an empty array
    const investments = JSON.parse(localStorage.getItem("investments")) || [];
    const investmentTableBody = document.getElementById("investment-table-body");
    const totalValueDiv = document.getElementById("total-value");

    const addInvestmentForm = document.getElementById("add-investment-form");
    const addInvestmentBtn = document.getElementById("add-investment-btn");
    const submitInvestmentBtn = document.getElementById("submit-investment");
    const cancelInvestmentBtn = document.getElementById("cancel-investment");

    // Function to update the investment portfolio display
    function updatePortfolio() {
        investmentTableBody.innerHTML = ""; // Clear the current table body
        let totalValue = 0; // Initialize total value

        // Loop through investments to populate the table
        investments.forEach((investment, index) => {
            const { assetName, investedAmount, currentValue } = investment;
            const percentageChange = ((currentValue - investedAmount) / investedAmount * 100).toFixed(2); // Calculate percentage change

            totalValue += currentValue; // Update total value

            // Create a new row for the investment
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="border px-4 py-2">${assetName}</td>
                <td class="border px-4 py-2">$${investedAmount}</td>
                <td class="border px-4 py-2">$${currentValue}</td>
                <td class="border px-4 py-2">${percentageChange}%</td>
                <td class="border px-4 py-2">
                    <button onclick="updateInvestment(${index})" class="bg-yellow-500 text-white py-1 px-2 rounded">Update</button>
                    <button onclick="removeInvestment(${index})" class="bg-red-500 text-white py-1 px-2 rounded">Remove</button>
                </td>
            `;
            investmentTableBody.appendChild(row); // Append the new row to the table body
        });

        totalValueDiv.textContent = `Total Portfolio Value: $${totalValue.toFixed(2)}`; // Update total value display
        localStorage.setItem("investments", JSON.stringify(investments)); // Save investments to localStorage
    }

    // Function to remove an investment by index
    window.removeInvestment = (index) => {
        investments.splice(index, 1); // Remove the investment from the array
        updatePortfolio(); // Refresh the portfolio display
    };

    // Function to pre-fill the form for updating an investment
    window.updateInvestment = (index) => {
        const investment = investments[index]; // Get the investment to update
        document.getElementById("asset-name").value = investment.assetName;
        document.getElementById("investment-amount").value = investment.investedAmount;
        document.getElementById("current-value").value = investment.currentValue;
        addInvestmentForm.classList.remove("hidden"); // Show the form
        addInvestmentForm.dataset.index = index; // Set the index for updating
    };

    // Event listener for adding or updating an investment
    submitInvestmentBtn.addEventListener("click", () => {
        const assetName = document.getElementById("asset-name").value.trim(); // Get asset name
        const investedAmount = parseFloat(document.getElementById("investment-amount").value); // Get invested amount
        const currentValue = parseFloat(document.getElementById("current-value").value); // Get current value
        
        // Validate inputs
        if (assetName === "" || isNaN(investedAmount) || isNaN(currentValue)) {
            alert("Please fill in all fields correctly."); // Alert if validation fails
            return;
        }

        const index = addInvestmentForm.dataset.index; // Get the index for updating

        // Check if updating an existing investment or adding a new one
        if (index !== undefined && index !== "") {
            investments[index] = { assetName, investedAmount, currentValue }; // Update existing investment
        } else {
            investments.push({ assetName, investedAmount, currentValue }); // Add new investment
        }

        addInvestmentForm.classList.add("hidden"); // Hide the form after submission
        addInvestmentForm.dataset.index = ""; // Reset index for future additions
        updatePortfolio(); // Refresh the portfolio display
    });

    // Event listener for showing the add investment form
    addInvestmentBtn.addEventListener("click", () => {
        addInvestmentForm.classList.remove("hidden"); // Show the form
        addInvestmentForm.dataset.index = ""; // Reset index for new investment
        document.getElementById("asset-name").value = ""; // Clear input fields
        document.getElementById("investment-amount").value = "";
        document.getElementById("current-value").value = "";
    });

    // Event listener for canceling the investment form
    cancelInvestmentBtn.addEventListener("click", () => {
        addInvestmentForm.classList.add("hidden"); // Hide the form
    });

    updatePortfolio(); // Initial call to populate the portfolio
});
