const URL = 'http://localhost:8081';
let entries = [];
let isSave = true;

const dateAndTimeToDate = (dateString, timeString) => {
    return new Date(`${dateString}T${timeString}`).toISOString();
};

const createEntry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entry = {};
    entry['checkIn'] = dateAndTimeToDate(formData.get('checkInDate'), formData.get('checkInTime'));
    entry['checkOut'] = dateAndTimeToDate(formData.get('checkOutDate'), formData.get('checkOutTime'));

    if (entry.checkIn > entry.checkOut) {
        alert("The check-in-date can't occur after the check-out-date!");
    } else {
        fetch(`${URL}/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        }).then((result) => {
            result.json().then((entry) => {
                entries.push(entry);
                renderEntries();
            });
        });
    }

};

const safeEntry = (e) => {
    if (isSave){
        createEntry(e);
    }else {


    }
};

const deleteEntry = (id) => {
    fetch(`${URL}/entries/${id}`, {
        method: 'DELETE'
    }).then(indexEntries);
};

const editEntry = (entry) => {
    jQuery("#createEntryForm").ready(function () {
        jQuery("#checkIn").val(entry.checkIn.substring(0, 10));
        jQuery("#checkInTime").val(entry.checkIn.substring(11, entry.checkIn.length))
        jQuery("#checkOut").val(entry.checkOut.substring(0, 10));
        jQuery("#checkOutTime").val(entry.checkOut.substring(11, entry.checkOut.length))
    });

    console.log(JSON.stringify(entry.id, entry.checkIn));
    fetch(`${URL}/entries/${entry.id}`, {
        method: 'PUT',
        body: JSON.stringify(entry.id, entry)
    }).then((result) => {
        result.json().then(() => {
            entries.push(entry.id, entry);
            indexEntries();
        });
    });
    isSave = true;

};


const indexEntries = () => {
    fetch(`${URL}/entries`, {
        method: 'GET',
        headers: {'Authorization': localStorage.getItem('token')}
    }).then((result) => {
        result.json().then((result) => {
            entries = result;
            renderEntries();
        });
    });
    renderEntries();
};

const createCell = (text) => {
    const cell = document.createElement('td');
    cell.innerHTML = text;
    return cell;
};

const renderEntries = () => {
    const display = document.querySelector('#entryDisplay');
    display.innerHTML = '';
    entries.forEach((entry) => {
        const row = document.createElement('tr');
        row.appendChild(createCell(entry.id));
        row.appendChild(createCell(new Date(entry.checkIn).toLocaleString()));
        row.appendChild(createCell(new Date(entry.checkOut).toLocaleString()));
        row.appendChild(createCell('<button onclick="deleteEntry(' + entry.id + ')">Delete</button>'));
        row.appendChild(createCell('<button id="' + entry.id + '">Edit</button>'));
        display.appendChild(row);
        jQuery("#" + entry.id).click(function () {
            editEntry(entry);
            isSave = false;
        });
    });
};

document.addEventListener('DOMContentLoaded', function () {
        const createEntryForm = document.querySelector('#createEntryForm');
        createEntryForm.addEventListener('submit', safeEntry);
        indexEntries();
});