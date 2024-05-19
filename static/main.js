    // Fetches the list of files from the server and populates the dropdown
function populateDropdown() {
        fetch('/get_files')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(files => {
            const dropdown = document.getElementById('fileDropdown');
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.text = file;
                dropdown.add(option);
            });
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
        });
    }

// Downloads the selected file
function downloadFile() {
        const dropdown = document.getElementById('fileDropdown');
        const selectedFile = dropdown.value;
        if (selectedFile) {
            window.location.href = `/download_excel_from_file?filename=${selectedFile}`;
        } else {
            alert('Please select a file to download.');
        }
}

function deleteAllExcelFiles() {
    var confirmation = confirm("Are you sure you want to delete all Excel files?");
    if (confirmation) {
        fetch("/delete-all-excel-files", {
            method: "POST",
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                alert(data.message);
                // Optionally, clear the dropdown:
                var dropdown = document.getElementById("fileDropdown");
                while (dropdown.firstChild) {
                    dropdown.removeChild(dropdown.firstChild);
                }
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was an error deleting the files.");
        });
    }
}


// Call the populateDropdown function on page load
document.addEventListener("DOMContentLoaded", function() {
    populateDropdown();
});


// Stop Processing Button
function stopProcessing() {
    fetch('/stop_processing', { method: 'POST' })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));
}

document.addEventListener("DOMContentLoaded", function() {
    const progressElement = document.getElementById("progress");
    const progressTextElement = document.getElementById("progressText");
    const messageDivElement = document.getElementById('confirmationMessage');

    function createElement(tag, attrs, children) {
        const el = document.createElement(tag);
        for (let key in attrs) {
            el[key] = attrs[key];
        }
        if (children) {
            children.forEach(child => el.appendChild(child));
        }
        return el;
    }

    function createAndAppendTableRows(dataJSON) {
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';
        dataJSON.forEach(dataItem => {
            const row = createElement('tr', {}, []);
            ['id', 'anchor', 'linking_url', 'topic', 'live_url', 'Host_site'].forEach(column => {
                const cell = createElement('td', {textContent: dataItem[column]});
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }

    // Form submission handling
    const form = document.getElementById("uploadForm");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        document.getElementById("progress").style.display = "block";
        fetch('/start_emit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                document.getElementById("progressText").innerText = data.message;
            }
        });
    });

    // Socket.io connection
    const socket = io.connect('http://' + document.domain + ':' + location.port, {
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 5
    });

    socket.on('update', function(data) {
        if (data.data) {
            createAndAppendTableRows(JSON.parse(data.data));
        }
        if (data.message) {
//            messageDivElement.innerHTML = data.message;
//            messageDivElement.style.display = "block";
//
//            if (["Processing complete.", "Process stopped"].includes(data.message)) {
//                progressElement.style.display = "none";
//            }

            if (data.message === "Processing Ended") {
                alert("Job Processing is complete!");
            }
            else if (data.message === "Process stopped") {
                alert("Job Cancelled By User!");
            }
        }

        if (data.error) {
            alert('Error: ' + data.error);
        }
    });


    // Progress spinner and text setup
    const progressDiv = createElement('div', {id: 'progress', style: 'display: none'});
    const spinner = createElement('div', {className: 'spinner-border text-primary', role: 'status'});
    const span = createElement('span', {className: 'sr-only', innerText: 'Processing...'});
    const progressText = createElement('h3', {id: 'progressText', innerText: 'Processing...'});
    progressText.style.color = 'red';
    spinner.appendChild(span);
    progressDiv.appendChild(spinner);
    progressDiv.appendChild(progressText);
    document.getElementById("progressContainer").appendChild(progressDiv);

});
