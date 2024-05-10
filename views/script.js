window.onload = function() {
    // Get all the date cells
    var dateCells = document.getElementsByTagName('td');

    // Add an event listener to each date cell
    for (var i = 0; i < dateCells.length; i++) {
        dateCells[i].addEventListener('click', function() {
            // Remove the highlighted class from all cells
            for (var j = 0; j < dateCells.length; j++) {
                dateCells[j].classList.remove('highlighted');
            }

            // Add the highlighted class to the clicked cell
            this.classList.add('highlighted');
        });
    }
};